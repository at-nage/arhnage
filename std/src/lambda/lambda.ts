import { Abort } from "../abort/abort.ts";
import { Is } from "../is/index.ts";
import { pipe } from "../pipe/pipe.ts";
import { Arguments, Compose, Head, Merge, Tail } from "./types.ts";

// deno-lint-ignore no-explicit-any
export type Lambda<A extends any[] = any[], R = any> = (...args: A) => R;

function identity<T>(value: T) {
	return value;
}

function log<T>(value: T) {
	console.log(value);
	return value;
}

function run<F extends Lambda>(...args: Arguments<F>) {
	return (lambda: F) => lambda(...args);
}

function call<R>(lambda: Lambda<[], R>) {
	return lambda();
}

function toggle(boolean: boolean) {
	return !boolean;
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

function combine(...Lambdas: Array<Lambda<[], void>>): Lambda<[], void> {
	return () => Lambdas.forEach(Lambda.call);
}

const compose: Compose = <A>(...lambdas: Lambda<[A], A>[]) => {
	return (arg: A) => lambdas.reduce((arg, lambda) => lambda(arg), arg);
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
		switch (lambda.length - args.length) {
			case 0:
				return lambda(...args);
			case 1:
				//@ts-expect-error typing is hard
				return (arg: Head<A>) => lambda(arg, ...args);
			default:
				throw new Error("can't call function with this set of arguments");
		}
	}) as {
		(...args: Tail<A>): (arg: Head<A>) => R;
		(...args: A): R;
	};
}

interface DebounceOptions {
	abort?: Abort;
}

const debounce = fflip(<F extends Lambda>(lambda: F, delay = 0, options: DebounceOptions = {}) => {
	const { abort } = options;

	let cleanup = Lambda.identity<void>;
	let timeout: number;

	return (...args: Parameters<F>): Promise<ReturnType<F>> => {
		cleanup();

		const { promise, resolve, reject } = Promise.withResolvers<ReturnType<F>>();
		
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

		return promise;
	};
});

export const Lambda = {
	identity,
	log,
	run,
	call,
	toggle,
	increment,
	decrement,
	multiply,
	divide,
	combine,
	compose,
	merge,
	unpack,
	cache,
	fflip,
	debounce,
};
