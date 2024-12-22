// deno-lint-ignore-file no-explicit-any

import { Emitter } from "@arhnage/eventable";
import { Lens } from "@arhnage/optics";
import { Cleanup, Is, Lambda, Struct, Type, UnreachableError } from "@arhnage/std";

import { Args, Effect, Get, Iter, Map, Over, Set, Subscribe } from "./type.ts";

export const $store = Symbol.for("store");
export type $store = typeof $store;

export const $value = Symbol.for("value");
export type $value = typeof $value;

const lens = Lens.property($value);

type Accessor<T> = {
	[$value]: Array<T>;
};

interface StoreEvents<T> {
	changed: { index: number; value: T };
}

export type Store<T = any> = Accessor<T> & Emitter<StoreEvents<T>>;

export function store<T>(initial: Array<T> = []): Store<T> {
	return <Store<T>>Struct.assign(
		//
		Type.create($store),
		{ [$value]: initial },
		Emitter.create<StoreEvents<T>>(),
	);
}

const get: Get = <T>(store: Store<T> | number, index?: number) => {
	if (Is.store(store) && Is.undefined(index)) {
		return Lens.get(lens, store);
	}

	if (Is.store(store) && Is.number(index)) {
		return Lens.get(Lens.compose(lens, Lens.property(index)), store);
	}

	if (Is.number(store) && Is.undefined(index)) {
		return <T>(source: Store<T>) => Lens.get(Lens.compose(lens, Lens.property(store)), source);
	}

	throw new UnreachableError();
};

const set = <Set>Lambda.fflip(<T>(store: Store<T>, index: number, value: T, equal: (left: T, right: T) => boolean = Object.is) => {
	const composed = Lens.compose(lens, Lens.property(index));
	if (!equal(Lens.get(composed, store), value)) {
		Lens.set(composed, store, value);
		Emitter.fire(store, "changed", { index, value });
	}

	return store;
});

const iter = <Iter>Lambda.fflip(<T>(store: Store<T>, lambda: (value: T, index: number) => void) => {
	for (let index = 0; index < Store.get(store).length; index++) {
		lambda(Store.get(store, index), index);
	}

	return store;
});

const over = <Over>Lambda.fflip(<T>(store: Store<T>, index: number, lambda: (value: T) => T, equal: (left: T, right: T) => boolean = Object.is) => {
	return Store.set(store, index, lambda(Store.get(store, index)), equal);
});

const map = <Map>Lambda.fflip(<T>(store: Store<T>, lambda: (value: T, index: number) => T, equal: (left: T, right: T) => boolean = Object.is) => {
	for (let index = 0; index < Store.get(store).length; index++) {
		Store.set(store, index, lambda(Store.get(store, index), index), equal);
	}

	return store;
});

const subscribe = <Subscribe>Lambda.fflip(<T>(source: Store<T>, listener: (index: number, value: T) => void) => {
	const mapped = (arg: { index: number; value: T }) => listener(arg.index, arg.value);

	Emitter.subscribe(source, "changed", mapped);

	source[$value].forEach((value, index) => listener(index, value));

	return () => Emitter.unsubscribe(source, "changed", mapped);
});

const effect: Effect = <S extends Store[]>(listener: (index: number, ...args: Args<S>) => void | Cleanup, stores: S): Cleanup => {
	const unsubscribe: Cleanup[] = [];
	const cleanups: (void | Cleanup)[] = [];

	for (const i in stores) {
		unsubscribe[i] = Store.subscribe(stores[i], (index) => {
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

export const Store = {
	create: store,
	get,
	set,
	over,
	map,
	iter,
	subscribe,
	effect,
};
