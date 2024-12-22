import { UnreachableError } from "../errors/index.ts";
import { Is } from "../is/index.ts";
import { Lambda } from "../lambda/index.ts";
import { Lazy } from "../lazy/lazy.ts";
import { Struct } from "../struct/index.ts";
import { Type } from "../type/type.ts";

import { Bind, Iter, Map, Match } from "./types.ts";

export const $none = Symbol.for("none");
export type $none = typeof $none;

export const $some = Symbol.for("some");
export type $some = typeof $some;

export const $value = Symbol.for("value");
export type $value = typeof $value;

// deno-lint-ignore no-empty-interface
export interface None {}

export interface Some<V> {
	[$value]: V;
}

export type Option<V> = None | Some<V>;

const none: Option<unknown> = Type.create($none);

function some<V>(value: V): Option<V> {
	return Struct.assign(
		Type.create($some),
		{ [$value]: value }
	);
}

const bind = <Bind>Lambda.fflip(<V, R>(option: Option<V>, binder: (value: V) => Option<R>) => {
	return Option.match(option, Option.none, binder);
})

const map = <Map>Lambda.fflip(<V, R>(option: Option<V>, mapper: (value: V) => R) => {
	return Option.match(option, Option.none, Lambda.compose(mapper, Option.some));
});

const iter = <Iter>Lambda.fflip(<V>(option: Option<V>, mapper: (value: V) => void) => {
	Option.match(option, Option.none, Lambda.compose(mapper, Option.some));
});

const match = <Match>Lambda.fflip(<V, R>(option: Option<V>, on_none: Lazy<R>, on_some: (value: V) => R) => {
  switch (true) {
		case Is.none(option):
      return Lazy.get(on_none);
    case Is.some(option):
      return on_some(option[$value]);
    default:
      throw new UnreachableError();
  }
});

export const Option = {
	none: () => none,
	some,
	match,
	bind,
	map,
	iter,
};
