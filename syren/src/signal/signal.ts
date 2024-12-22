// deno-lint-ignore-file no-explicit-any

import { Emitter } from "@arhnage/eventable";
import { Cleanup, Is, Lambda, Lazy, Struct, Type } from "@arhnage/std";

import { Args, Computed, Effect, Middleware, Over, Set, Subscribe } from "./types.ts";

export const $signal = Symbol.for("signal");
export type $signal = typeof $signal;

const $value = Symbol.for("value");
type $value = typeof $value;

const $initial = Symbol.for("initial");
type $initial = typeof $initial;

type Accessor<T> = {
	[$initial]: Lazy<T>;
	[$value]: T;
};

interface SignalEvents<T> {
	changed: T;
}

export type Signal<T = any> = Accessor<T> & Emitter<SignalEvents<T>>;
export type Value<S extends Signal> = S[$value];

export function signal<T>(initial: Lazy<T>) {
	return <Signal<T>>Struct.assign(
		//
		Type.create($signal),
		{ [$initial]: initial, [$value]: Lazy.get(initial) },
		Emitter.create<SignalEvents<T>>(),
	);
}

function get<T>(source: Signal<T>): T {
	return source[$value];
}

const pop = <T>(source: Signal<T>): T => {
	const value = Signal.get(source);
	Signal.reset(source);
	return value;
};

const set: Set = Lambda.fflip(<T>(source: Signal<T>, value: T, equal: (left: T, right: T) => boolean = Object.is) => {
	if (!equal(source[$value], value)) {
		source[$value] = value;
		Emitter.fire(source, "changed", value);
	}

	return source;
});

const reset = <T>(source: Signal<T>) => {
	const value = Lazy.get(source[$initial]);
	source[$value] = value;
	Emitter.fire(source, "changed", value);
	return source;
};

const over: Over = Lambda.fflip(<T>(source: Signal<T>, lambda: (value: T) => T) => {
	return Signal.set(source, lambda(Signal.get(source)));
});

const subscribe: Subscribe = Lambda.fflip(<T>(source: Signal<T>, listener: (args: T) => void) => {
	listener(Signal.get(source));
	return Emitter.subscribe(source, "changed", listener);
});

const middleware: Middleware = Lambda.fflip(<T>(signal: Signal<T>, ...middlewares: Array<(signal: Signal<T>) => void>) => {
	middlewares.forEach(Lambda.run(signal));
	return signal;
});

const effect: Effect = <S extends Signal[]>(listener: (...args: Args<S>) => void | Cleanup, signals: S): Cleanup => {
	const unsubscribe: Cleanup[] = [];
	let cleanup: void | Cleanup;

	for (const i in signals) {
		unsubscribe[i] = Signal.subscribe(signals[i], () => {
			if (Is.lambda(cleanup)) {
				cleanup();
				cleanup = undefined;
			}

			const args = signals.map(Signal.get) as Args<S>;
			cleanup = listener(...args);
		});
	}

	return () => unsubscribe.forEach(Lambda.call);
};

const computed: Computed = <T, S extends Signal[]>(listener: (...args: Args<S>) => T, signals: S): Signal<T> => {
	const args = signals.map(Signal.get) as Args<S>;

	const computed = signal<T>(listener(...args));

	effect((...args: Args<S>) => {
		Signal.set(computed, listener(...args));
	}, signals);

	return computed;
};

export const Signal = {
	create: signal,
	get,
	pop,
	set,
	reset,
	over,
	subscribe,
	middleware,
	effect,
	computed,
};
