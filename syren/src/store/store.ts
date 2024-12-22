// deno-lint-ignore-file no-explicit-any

import { Emitter } from "@arhnage/eventable";
import { Cleanup, Is, Lambda, Struct, Type, UnreachableError } from "@arhnage/std";

import { Signal } from "../index.ts";
import { Add, Get, Insert, Iter, Map, Over, Remove, Replace, Set } from "./type.ts";

export const $store = Symbol.for("store");
export type $store = typeof $store;

export const $value = Symbol.for("value");
export type $value = typeof $value;

type Accessor<T> = {
	[$value]: Array<T>;
};

export interface StoreEvents<T> {
	changed: T[];
	added: { index: number; value: T };
	removed: { index: number; value: T };
	inserted: { index: number; value: T };
	replaced: { index: number; value: T };
}

export type Store<T = any> = Accessor<T> & Emitter<StoreEvents<T>>;

export function store<T>(initial: Array<T> | undefined = []): Store<T> {
	return <Store<T>>Struct.assign(
		//
		Type.create($store),
		{ [$value]: initial },
		Emitter.create<StoreEvents<T>>(),
	);
}

const get: Get = <T>(store: Store<T> | number | [number], index?: number | [number]) => {
	if (Is.store(store) && Is.undefined(index)) {
		return store[$value];
	}

	if (Is.store(store) && Is.number(index)) {
		return store[$value][index];
	}

	if (Is.store(store) && Is.array(index)) {
		return index.reduce((value: any, key) => value[key], store[$value]);
	}

	if (Is.number(store) && Is.undefined(index)) {
		return (source: Store<any>) => source[$value][store];
	}

	if (Is.array(store) && Is.undefined(index)) {
		return (source: Store<any>) => store.reduce((value: any, key) => value[key], source[$value]);
	}

	throw new UnreachableError();
};

const set: Set = Lambda.fflip(<T>(store: Store<T>, value: T[] | Signal<T[]>) => {
	if (Is.signal(value)) {
		value = Signal.get(value);
	}

	store[$value] = value;
	Emitter.fire(store, "changed", value);

	return store;
});

const insert: Insert = Lambda.fflip(<T>(store: Store<T>, index_value: number | T | Signal<T>, value: T | Signal<T> | null = null) => {
	if (Is.null(value)) {
		if (Is.signal(index_value)) {
			index_value = Signal.get(index_value);
		}

		const index = store[$value].length;
		store[$value].push(index_value);
		Emitter.fire(store, "inserted", { index, value: index_value });
	}

	if(Is.number(index_value) && Is.not_null(value)) {
		if (Is.signal(value)) {
			value = Signal.get(value);
		}

		store[$value].splice(index_value, 1, value);
		Emitter.fire(store, "inserted", { index: index_value, value });
	}

	return store;
});

const replace: Replace = Lambda.fflip(<T>(store: Store<T>, index: number | [number], value: T | Signal<T>, equal: (left: T, right: T) => boolean = Object.is) => {
	if (Is.signal(value)) {
		value = Signal.get(value);
	}

	if (Is.number(index)) {		
		if (!equal(store[$value][index], value)) {
			store[$value][index] = value;
			Emitter.fire(store, "replaced", { index, value });
		}
	}

	if (Is.array(index)) {
		const [i, ...keys] = index;
		const current = keys.reduce((value, key) => value[key], store[$value][i]);

		if (!equal(current, value)) {
			let last = i;
			let source: any = store[$value];

			for (const key of keys) {
				source = source[last];
				last = key;
			}

			source[last] = value;

			Emitter.fire(store, "replaced", { index: i, value: store[$value][i] });
		}
	}

	return store;
});

const remove: Remove = Lambda.fflip(<T>(store: Store<T>, value: T | Signal<T>, equal: (left: T, right: T) => boolean = Object.is) => {
	if (Is.signal(value)) {
		value = Signal.get(value);
	}

	const index = store[$value].findIndex((item) => equal(item, value));
	if (index == -1) return store;

	store[$value].splice(index, 1);
	Emitter.fire(store, "removed", { index, value });

	return store;
});

const iter: Iter = Lambda.fflip(<T>(store: Store<T>, lambda: (value: T, index: number) => void) => {
	for (let index = 0; index < Store.get(store).length; index++) {
		lambda(Store.get(store, index), index);
	}

	return store;
});

const over: Over = Lambda.fflip(<T>(store: Store<T>, index: number, lambda: (value: T) => T, equal: (left: T, right: T) => boolean = Object.is) => {
	return Store.insert(store, index, lambda(Store.get(store, index)), equal);
});

const map: Map = Lambda.fflip(<T>(store: Store<T>, lambda: (value: T, index: number) => T, equal: (left: T, right: T) => boolean = Object.is) => {
	for (let index = 0; index < Store.get(store).length; index++) {
		Store.insert(store, index, lambda(Store.get(store, index), index), equal);
	}

	return store;
});

export interface Subscribe {
	<T>(listener: (args: T[]) => void): (source: Store<T>) => Cleanup;
	<T>(source: Store<T>, listener: (args: T[]) => void): Cleanup;
}

const subscribe: Subscribe = Lambda.fflip(<T>(source: Store<T>, listener: (args: T[]) => void) => {
	listener(Store.get(source));
	return Emitter.subscribe(source, "changed", listener);
});

/*
const effect: Effect = <S extends Store[]>(listener: (index: number, ...args: Args<S>) => void | Cleanup, stores: S): Cleanup => {
	const unsubscribe: Cleanup[] = [];
	const cleanups: (void | Cleanup)[] = [];

	for (const i in stores) {
		unsubscribe[i] = Emitter.subscribe(stores[i], "set", ({ index }) => {
			if (Is.lambda(cleanups[index])) {
				cleanups[index]();
				cleanups[index] = undefined;
			}

			const args = stores.map((store) => Store.get(store, index)) as Args<S>;
			cleanups[index] = listener(index, ...args);
		});
	}

	return () => unsubscribe.forEach(Lambda.call);
};
*/

export interface Middleware {
	<T>(...middlewares: Array<(source: Store<T>) => void>): (source: Store<T>) => Store<T>;
	<T>(source: Store<T>, ...middlewares: Array<(source: Store<T>) => void>): Store<T>;
}

const middleware: Middleware = Lambda.fflip(<T>(source: Store<T>, ...middlewares: Array<(source: Store<T>) => void>) => {
	middlewares.forEach(Lambda.run(source));
	return source;
});

export const Store = {
	create: store,
	get,
	set,
	insert,
	replace,
	remove,
	over,
	map,
	iter,
	subscribe,
	// effect,
	middleware,
};
