import type { Lazy } from "../lazy/index.ts";

import type { Option } from "./option.ts";

export interface Bind {
	<V, R>(binder: (value: V) => Option<R>): (option: Option<V>) => Option<R>
	<V, R>(option: Option<V>, binder: (value: V) => Option<R>): Option<R>;
}

export interface Map {
	<V, R>(mapper: (value: V) => R): (option: Option<V>) => Option<R>
	<V, R>(option: Option<V>, mapper: (value: V) => R): Option<R>;
}

export interface Iter {
	<V>(mapper: (value: V) => void): (option: Option<V>) => void;
	<V>(option: Option<V>, mapper: (value: V) => void): void;
}

export interface Match {
	<V, R>(on_none: Lazy<R>, on_some: (value: V) => R): (option: Option<V>) => R;
	<V, R>(option: Option<V>, on_none: Lazy<R>, on_some: (value: V) => R): R;
}
