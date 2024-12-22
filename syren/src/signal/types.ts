import type { Cleanup } from "@arhnage/std";

import type { Value, Signal } from "./signal.ts";

export type Args<S extends Signal[]> = { [K in keyof S]: Value<S[K]> };

export interface Set {
	<T>(value: T, equal?: (left: T, right: T) => boolean): (source: Signal<T>) => Signal<T>;
	<T>(source: Signal<T>, value: T, equal?: (left: T, right: T) => boolean): Signal<T>;
}

export interface Over {
	<T>(lambda: (value: T) => T): (source: Signal<T>) => Signal<T>;
	<T>(source: Signal<T>, lambda: (value: T) => T): Signal<T>;
}

export interface Subscribe {
	<T>(listener: (args: T) => void): (source: Signal<T>) => Cleanup;
	<T>(source: Signal<T>, listener: (args: T) => void): Cleanup;
}

export interface Middleware {
	<T>(...middlewares: Array<(signal: Signal<T>) => void>): (source: Signal<T>) => Signal<T>;
	<T>(source: Signal<T>, ...middlewares: Array<(signal: Signal<T>) => void>): Signal<T>;
}

export interface Effect {
	<S extends Signal>(listener: (arg: Value<S>) => void | Cleanup, signals: [S]): Cleanup;
	<S1 extends Signal, S2 extends Signal>(listener: (arg_1: Value<S1>, arg_2: Value<S2>) => void | Cleanup, signals: [S1, S2]): Cleanup;
	<S1 extends Signal, S2 extends Signal, S3 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>) => void | Cleanup,
		signals: [S1, S2, S3],
	): Cleanup;
	<S1 extends Signal, S2 extends Signal, S3 extends Signal, S4 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>) => void | Cleanup,
		signals: [S1, S2, S3, S4],
	): Cleanup;
	<S1 extends Signal, S2 extends Signal, S3 extends Signal, S4 extends Signal, S5 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>, arg_5: Value<S5>) => void | Cleanup,
		signals: [S1, S2, S3, S4, S5],
	): Cleanup;
	<S1 extends Signal, S2 extends Signal, S3 extends Signal, S4 extends Signal, S5 extends Signal, S6 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>, arg_5: Value<S5>, arg_6: Value<S6>) => void | Cleanup,
		signals: [S1, S2, S3, S4, S5, S6],
	): Cleanup;
	<S extends Signal[]>(listener: (...args: Args<S>) => void | Cleanup, signals: S): Cleanup;
}

export interface Computed {
	<T, S extends Signal>(listener: (arg: Value<S>) => T, signals: [S]): Signal<T>;
	<T, S1 extends Signal, S2 extends Signal>(listener: (arg_1: Value<S1>, arg_2: Value<S2>) => T, signals: [S1, S2]): Signal<T>;
	<T, S1 extends Signal, S2 extends Signal, S3 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>) => T,
		signals: [S1, S2, S3],
	): Signal<T>;
	<T, S1 extends Signal, S2 extends Signal, S3 extends Signal, S4 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>) => T,
		signals: [S1, S2, S3, S4],
	): Signal<T>;
	<T, S1 extends Signal, S2 extends Signal, S3 extends Signal, S4 extends Signal, S5 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>, arg_5: Value<S5>) => T,
		signals: [S1, S2, S3, S4, S5],
	): Signal<T>;
	<T, S1 extends Signal, S2 extends Signal, S3 extends Signal, S4 extends Signal, S5 extends Signal, S6 extends Signal>(
		listener: (arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>, arg_5: Value<S5>, arg_6: Value<S6>) => T,
		signals: [S1, S2, S3, S4, S5, S6],
	): Signal<T>;
	<T, S extends Signal[]>(listener: (...args: Args<S>) => T, signals: S): Signal<T>;
}
