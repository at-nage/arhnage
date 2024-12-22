// deno-lint-ignore-file no-explicit-any

import { Emitter } from "@arhnage/eventable";
import { Lens } from "@arhnage/optics";
import { Cleanup, Is, Lambda, Struct, Type } from "@arhnage/std";

import { Args, Computed, Effect, Middleware, Over, Set, Subscribe } from "./types.ts";

export const $signal = Symbol.for("signal");
export type $signal = typeof $signal;

export const $value = Symbol.for("value");
export type $value = typeof $value;

const lens = Lens.property($value);

type Accessor<T> = {
	[$value]: T;
};

interface SignalEvents<T> {
	changed: T;
}

export type Signal<T = any> = Accessor<T> & Emitter<SignalEvents<T>>;

export function signal<T>(initial: T) {
	return <Signal<T>>Struct.assign(
		//
		Type.create($signal),
		{ [$value]: initial },
		Emitter.create<SignalEvents<T>>(),
	);
}

function get<T>(source: Signal<T>): T {
	return Lens.get(lens, source);
}

const set = <Set>Lambda.fflip(<T>(source: Signal<T>, value: T, equal: (left: T, right: T) => boolean = Object.is) => {
	if (!equal(Signal.get(source), value)) {
		Lens.set(lens, source, value);
		Emitter.fire(source, "changed", value);
	}

	return source;
});

const over = <Over>Lambda.fflip(<T>(source: Signal<T>, lambda: (value: T) => T) => {
	return Signal.set(source, lambda(Signal.get(source)));
});

const subscribe = <Subscribe>Lambda.fflip(<T>(source: Signal<T>, listener: (args: T) => void) => {
	Emitter.subscribe(source, "changed", listener);
	listener(Signal.get(source));
	return () => Emitter.unsubscribe(source, "changed", listener);
});

const middleware = <Middleware>Lambda.fflip(<T>(signal: Signal<T>, ...middlewares: Array<(signal: Signal<T>) => void>) => {
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
	set,
	over,
	subscribe,
	middleware,
	effect,
	computed,
};
