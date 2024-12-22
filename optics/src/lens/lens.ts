// deno-lint-ignore-file no-explicit-any
// https://hackage.haskell.org/package/optics-core-0.4.1.1/docs/Optics-Lens.html

import { key, keys, Lambda, Struct, Type } from "@arhnage/std";

import { Pull, Put } from "../types.ts";

import { Compose, Get, Over, Set } from "./types.ts";

export const $lens = Symbol.for("lens");
export type $lens = typeof $lens;

const $get = Symbol.for("get");
type $get = typeof $get;

const $set = Symbol.for("set");
type $set = typeof $set;

// lens' :: (s -> v) -> (s -> v -> s) -> Lens s s v v
export type Lens<K extends keys> = {
	[$get]: <T extends Put<K, unknown>>(source: T) => Pull<T, K>;
	[$set]: <T extends Put<K, unknown>>(source: T, value: Pull<T, K>) => T;
};

function property<K extends key>(key: K) {
	return Lens.create<K>(
		(source) => {
			return source[key];
		},
		(source, value) => {
			source[key] = value;
			return source;
		},
	);
}

function create<K extends key>(get: <T extends Struct<K>>(source: T) => T[K], set: <T extends Struct<K>>(source: T, value: T[K]) => T) {
	return <Lens<[K]>>Struct.assign(
		//
		Type.create($lens),
		{ [$get]: get, [$set]: set },
	);
}

const get: Get = Lambda.fflip((lens: Lens<keys>, source: Struct): any => {
	return lens[$get](source);
});

const set: Set = Lambda.fflip((lens: Lens<keys>, source: Struct, value: unknown) => {
	return lens[$set](source, value);
});

const over: Over = Lambda.fflip((lens: Lens<keys>, source: Struct, lambda: (value: unknown) => unknown): Struct => {
	return Lens.set(lens, source, lambda(Lens.get(lens, source)));
});

function compose_two(left: Lens<keys>, right: Lens<keys>) {
	return Lens.create<key>(
		(source: Struct) => Lens.get(right, Lens.get(left, source)),
		(source: Struct, value: unknown): any => Lens.set(left, source, Lens.set(right, <Struct>Lens.get(left, source), value)),
	);
}

const compose: Compose = (...lenses: Lens<any>[]): Lens<any> => {
	switch (lenses.length) {
		case 1: {
			const [lens] = lenses;
			return lens;
		}
		case 2: {
			const [left, right] = lenses;
			return compose_two(left, right);
		}
		default: {
			return lenses.reduceRight(compose_two);
		}
	}
};

export const Lens = {
	property: Lambda.cache(property),
	create,
	get,
	set,
	over,
	compose: Lambda.cache(compose),
};
