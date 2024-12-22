// deno-lint-ignore-file

import { Is, key, keys, Lambda, Option, pipe, Struct, Type, UnreachableError } from "@arhnage/std";

import { Lens } from "../lens/index.ts";
import { Pull, Put } from "../types.ts";

import { Build, Compose, Get, Over, Set } from "./types.ts";

export const $prism = Symbol.for("prism");
export type $prism = typeof $prism;

const $build = Symbol.for("build");
type $build = typeof $build;

const $get = Symbol.for("get");
type $get = typeof $get;

// prism' :: (v -> s) -> (s -> Maybe v) -> Prism s s v v
export type Prism<K extends keys> = {
	[$build]: <T extends Put<K, unknown>>(value: Pull<T, K>) => T;
	[$get]: <T extends Put<K, unknown>>(source: T) => Option<Pull<T, K>>;
};

function property<K extends key>(key: K) {
	return Prism.create<K>(
		<T extends Struct<K, unknown>>(value: T[K]) => {
			return <T>{ [key]: value };
		},
		<T extends Struct<K, unknown>>(source: T) => {
			const value = source[key];
			if (Is.undefined(value)) {
				return Option.none();
			}

			return Option.some(value);
		},
	);
}

function create<K extends key>(build: <T extends Struct<K, unknown>>(value: T[K]) => T, get: <T extends Struct<K, unknown>>(source: T) => Option<T[K]>) {
	return <Prism<[K]>>Struct.assign(
		//
		Type.create($prism),
		{ [$build]: build, [$get]: get },
	);
}

const build = Lambda.fflip((prism: Prism<keys>, value: Struct) => {
	return prism[$build](value);
});

const get = Lambda.fflip((prism: Prism<keys>, source: Struct) => {
	return prism[$get](source);
});

const set = Lambda.fflip((prism: Prism<keys>, source: Struct, value: unknown): Struct => {
	return Struct.assign(source, Prism.build(prism, value));
});

const over = Lambda.fflip((prism: Prism<keys>, source: Struct, lambda: (value: unknown) => unknown): Struct => {
	return Option.match(Prism.get(prism, source), source, (value) => Prism.set(prism, source, lambda(value)));
});

function compose_two(left: Lens<any>, right: Lens<any>): Lens<any>;
function compose_two(left: Prism<any>, right: Prism<any>): Prism<any>;
function compose_two(left: Lens<any> | Prism<any>, right: Prism<any>): Prism<any>;
function compose_two(left: Lens<any> | Prism<any>, right: Lens<any> | Prism<any>): Lens<any> | Prism<any>;
function compose_two(left: Lens<keys> | Prism<keys>, right: Lens<keys> | Prism<keys>): Lens<keys> | Prism<keys> {
	if (Is.lens(left)) {
		if (Is.lens(right)) {
			return Lens.compose(left, right);
		}

		return Prism.create(
			(value: unknown): any => Lens.set(left, <Struct>{}, Prism.build(right, value)),
			(source: Struct) => Prism.get(right, Lens.get(left, source)),
		);
	}

	if (Is.lens(right)) {
		return Prism.create(
			(value: unknown): any => Lens.set(right, <Struct>{}, Prism.build(left, value)),
			(source: Struct) => Option.bind(Prism.get(left, source), (source) => Lens.get(right, source)),
		);
	}

	return Prism.create(
		(value: unknown): any => Prism.build(right, Prism.build(left, value)),
		(source: Struct) => Option.bind(Prism.get(left, source), (source) => Prism.get(right, source)),
	);
}

const compose: Compose = (...prisms: (Lens<any> | Prism<any>)[]) => {
	switch (prisms.length) {
		case 1: {
			const [prism] = prisms;

			if (Is.lens(prism)) {
				throw new UnreachableError();
			}

			return prism;
		}
		case 2: {
			const [left, right] = prisms;

			if (Is.lens(right)) {
				throw new UnreachableError();
			}

			return compose_two(left, right);
		}
		default: {
			return prisms.reduceRight(compose_two) as Prism<any>;
		}
	}
};

export const Prism = {
	property: Lambda.cache(property),
	create,
	build: <Build>build,
	get: <Get>get,
	set: <Set>set,
	over: <Over>over,
	compose: Lambda.cache(compose),
};
