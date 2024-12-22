// deno-lint-ignore-file no-explicit-any

import { Emitter } from "@arhnage/eventable";
import { Lens } from "@arhnage/optics";
import { Is, Lambda, UnreachableError } from "@arhnage/std";

import { Get, Set } from "./types.ts";
import { pipe } from "@arhnage/std";

export const $slice = Symbol.for("slice");
export type $slice = typeof $slice;

export const $value = Symbol.for("value");
export type $value = typeof $value;

type Accessor<T> = {
	[$value]: T;
};

interface SignalEvents<T> {
	changed: { key: keyof T, value: T[keyof T]};
}

const lens = Lens.property($value);

export type Slice<T = any> = Accessor<T> & Emitter<SignalEvents<T>>;

const get = <Get>(<T, K extends keyof T>(slice: Slice<T> | K, key?: K) => {
	if (Is.slice(slice) && Is.undefined(key)) {
		return Lens.get(lens, slice);
	}

	if (Is.slice(slice) && Is.key(key)) {
		// @ts-expect-error typing is hard
    return Lens.get(Lens.compose(lens, Lens.property(key)), slice);
	}

	if (Is.key(slice) && Is.undefined(key)) {
		// @ts-expect-error typing is hard
		return (source: Slice<T>) => Lens.get(Lens.compose(lens, Lens.property(slice)), source);
	}

	throw new UnreachableError();
});

// const set = <Set>Lambda.fflip(<T, K extends keyof T>(slice: Slice<T>, key: K, value: T[K], equal: (left: T, right: T) => boolean = Object.is) => {
// 	const composed = Lens.compose(lens, Lens.property(key));
// 	Lens.get(composed, slice)
// 	if (!equal(Lens.get(composed, slice), value)) {
// 		Lens.set(composed, slice, value);
// 		Emitter.fire(slice, "changed", { key, value });
// 	}

// 	return slice;
// });

export const Slice = {
	get,
	// set,
};

const count = Lens.property("count");
const composed = Lens.compose(lens, count);
const slice = {} as Slice<{ count: number }>;

Lens.get(lens, slice);
Lens.get(composed, slice);
Lens.get(count, slice);

const get_in_slice = Lens.get(slice);

get_in_slice(lens);
get_in_slice(composed);
get_in_slice(count);

pipe(
	lens,
	Lens.get(slice)
)

pipe(
	count,
	Lens.get(slice)
)

pipe(
	composed,
	Lens.get(slice)
)
