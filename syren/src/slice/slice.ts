// deno-lint-ignore-file no-explicit-any

import { Emitter } from "@arhnage/eventable";
import { Is, key, Lambda, Type, UnreachableError } from "@arhnage/std";

import { Get, Over, Set, Subscribe } from "./types.ts";
import { Struct } from "@arhnage/std";

export const $slice = Symbol.for("slice");
export type $slice = typeof $slice;

export const $value = Symbol.for("value");
export type $value = typeof $value;

type Accessor<T> = {
	[$value]: T;
};

interface SliceEvents<T> {
	changed: { key: keyof T; value: T[keyof T] };
}

export type Slice<T = any> = Accessor<T> & Emitter<SliceEvents<T>>;

export function slice<T>(initial: T): Slice<T> {
	return <Slice<T>>Struct.assign(
		//
		Type.create($slice),
		{ [$value]: initial },
		Emitter.create<SliceEvents<T>>(),
	);
}

const get: Get = (slice: Slice<Struct> | string, key?: string) => {
	if (Is.slice(slice) && Is.undefined(key)) {
		return slice[$value];
	}

	if (Is.slice(slice) && Is.key(key)) {
		return slice[$value][key];
	}

	if (Is.key(slice) && Is.undefined(key)) {
		return (source: Slice<Struct>) => source[$value][slice];
	}

	throw new UnreachableError();
};

const set: Set = Lambda.fflip((slice: Slice<Struct>, key: string, value: unknown, equal: (left: unknown, right: unknown) => boolean = Object.is) => {
	if (!equal(slice[$value][key], value)) {
		slice[$value][key] = value;
		Emitter.fire(slice, "changed", { key, value });
	}

	return slice;
});

const over: Over = Lambda.fflip((store: Slice<Struct>, key: string, lambda: (value: Struct) => Struct, equal: (left: Struct, right: Struct) => boolean = Object.is) => {
	return Slice.set(store, key, lambda(Slice.get(store, key)), equal);
});

const subscribe: Subscribe = Lambda.fflip((source: Slice<Struct>, listener: (key: key, value: unknown) => void) => {
	const mapped = (arg: { key: key; value: unknown }) => listener(arg.key, arg.value);

	Emitter.subscribe(source, "changed", mapped);

	for (const key in source[$value]) {
		listener(key, source[$value][key])
	}

	return () => Emitter.unsubscribe(source, "changed", mapped);
});

export const Slice = {
	create: slice,
	get,
	set,
	over,
	subscribe,
};
