// deno-lint-ignore-file no-explicit-any

import { Abort } from "../abort/abort.ts";
import { Is } from "../is/index.ts";
import { pipe } from "../pipe/pipe.ts";

import { Arguments, Compose, Debounce, DebounceOptions, Head, Merge, Tail } from "./types.ts";

export type Lambda<A extends any[] = any[], R = any> = (...args: A) => R;

function identity<A>(value: A): A;
function identity<A, B>(value: A): B;
function identity<T>(value: T) {
	return value;
}

function log<T>(value: T) {
	console.log(value);
	return value;
}

function error<T>(value: T) {
	console.error(value);
	return value;
}

function run<F extends Lambda>(...args: Arguments<F>) {
	return (lambda: F) => lambda(...args);
}

function call<A>(lambda: Lambda<[], A>): A {
	return lambda();
}

function call1<A, B>(value: A, lambda: Lambda<[A], B>): B {
	return lambda(value);
}

function toggle(boolean: boolean) {
	return !boolean;
}

function predicate() {
	return true;
}

function increment(amount: number) {
	return (value: number) => value + amount;
}

function decrement(amount: number) {
	return (value: number) => value - amount;
}

function multiply(amount: number) {
	return (value: number) => value * amount;
}

function divide(amount: number) {
	return (value: number) => value / amount;
}

function bind<T, A extends unknown[], B>(local: T, lambda: (this: T, ...args: A) => B) {
	return lambda.bind(local);
}

function combine(...lambdas: Array<Lambda<[], void>>): Lambda<[], void> {
	return () => lambdas.forEach(Lambda.call);
}

const compose: Compose = <A>(...lambdas: Lambda<[A], A>[]) => {
	if (lambdas.length === 0) {
		return Lambda.identity<any>;
	}

	if (lambdas.length === 1) {
		return lambdas[0];
	}

	return (arg: A) => lambdas.reduce(Lambda.call1, arg);
};

const merge: Merge = <A>(...lambdas: Lambda<[A], A>[]) => {
	return (args: A) => lambdas.reduce((result, behavior) => Object.assign(result, behavior(args)), {});
};

function unpack<VALUE, ARGS extends unknown[]>(value: VALUE | Lambda<ARGS, VALUE>, ...args: ARGS): VALUE {
	return Is.lambda(value) ? value(...args) : value;
}

function get_or_set(map: Map<unknown, unknown>, arg: unknown, lambda: Lambda) {
	if (map.has(arg)) {
		return map.get(arg);
	}

	const value = lambda();
	map.set(arg, value);
	return value;
}

function cache<F extends Lambda>(lambda: F) {
	const cache = new Map();
	const reducer = (map: Map<unknown, unknown>, arg: unknown) => get_or_set(map, arg, () => new Map());

	const cached = (...args: Arguments<F>) => {
		const copy = Array.from(args);
		const last = copy.pop();
		const map = copy.length ? copy.reduce(reducer, cache) : cache;

		return get_or_set(map, last, () => lambda(...args));
	};

	return cached as F;
}

function fflip<A extends unknown[], R>(lambda: Lambda<A, R>) {
	return ((...args: A) => {
		const length = lambda.length - args.length;

		if (length > 0) {
			//@ts-expect-error typing is hard
			return (arg: Head<A>) => lambda(arg, ...args);
		}

		return lambda(...args);
	}) as {
		(...args: Tail<A>): (arg: Head<A>) => R;
		(...args: A): R;
	};
}

const debounce: Debounce = fflip((lambda: Lambda, delay: number, options: DebounceOptions = {}) => {
	const { abort, onerror } = Object.assign({ onerror: Lambda.identity<void> }, options);

	let cleanup = Lambda.identity<void>;
	let timeout: number;

	return (...args: unknown[]): Promise<any> => {
		cleanup();

		const { promise, resolve, reject } = Promise.withResolvers<unknown>();

		cleanup = () => {
			clearTimeout(timeout);
			reject();
		};

		const result = () => {
			resolve(lambda(...args));
			cleanup = Lambda.identity;
		};

		timeout = setTimeout(result, delay);

		if (abort) {
			pipe(
				abort,
				Abort.reset,
				Abort.subscribe(() => {
					result();
					clearTimeout(timeout);
				}),
			);
		}

		return promise.catch(onerror);
	};
});

export const Lambda = {
	identity,
	log,
	error,
	run,
	call,
	call1,
	toggle,
	predicate,
	increment,
	decrement,
	multiply,
	divide,
	bind,
	combine,
	compose,
	merge,
	unpack,
	cache,
	fflip,
	debounce,
};
