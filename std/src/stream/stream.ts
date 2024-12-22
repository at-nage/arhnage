// deno-lint-ignore-file no-explicit-any

import { Task } from "../task/index.ts";
import { Lambda } from "../lambda/index.ts";
import { DebounceOptions } from "../lambda/types.ts";

export type Stream = typeof Stream;

type Operate<A, B = A> = Lambda<[value: A, next: Lambda<[value: B], Task>], Task>

interface Pipe {
	<A, B, C>(operate_1: Operate<A, B>, operate_2: Operate<B, C>): Lambda<[A], Task>;
	<A, B, C, D>(operate_1: Operate<A, B>, operate_2: Operate<B, C>, operate_3: Operate<C, D>): Lambda<[A], Task>;
	<A, B, C, D, E>(operate_1: Operate<A, B>, operate_2: Operate<B, C>, operate_3: Operate<C, D>, operate_4: Operate<D, E>): Lambda<[A], Task>;
	<A, B, C, D, E, F>(operate_1: Operate<A, B>, operate_2: Operate<B, C>, operate_3: Operate<C, D>, operate_4: Operate<D, E>, operate_5: Operate<E, F>): Lambda<[A], Task>;
	<A, B, C, D, E, F, G>(operate_1: Operate<A, B>, operate_2: Operate<B, C>, operate_3: Operate<C, D>, operate_4: Operate<D, E>, operate_5: Operate<E, F>, operate_6: Operate<F, G>): Lambda<[A], Task>;
}

const pipe: Pipe = <A>(...pipeline: Array<Operate<any>>): Lambda<[A], Task> => {
	return async (value: A) => {
		const next = pipeline.reduceRight(
			(next, action) => (value) => action(value, next),
			Lambda.identity<A, Task>,
		);

		await next(value);
	};
};

function tap<A>(effect: Lambda<[A], void>): Operate<A> {
	return async (value, next) => {
    effect(value);
		await next(value);
	};
}

function debounce<A>(delay: number, options?: DebounceOptions): Operate<A> {
	return Lambda.debounce(Lambda.call1, delay, options);
}

function iif<T, S extends T, F extends Exclude<T, S>>(predicate: (value: T) => value is S, on_true: Lambda<[S], void>, on_false: Lambda<[F], void>): Operate<T>;
// function iif<A, F>(predicate: Lambda<[A], boolean>, on_true: Lambda<[A], void>, on_false: Lambda<[F], void>): Operate<A & F>;
function iif<A, F>(predicate: Lambda<[A], boolean>, on_true: Lambda<[A], void>, on_false: Lambda<[F], void>): Operate<A & F> {
  return async (value, next) => {
		if (predicate(value)) {
      on_true(value);
    } else {
      on_false(value as unknown as F);
    }

    await next(value);
	};
}

function map<A, B>(mapper: Lambda<[A], Task<B>>): Operate<A, B> {
	return async (value, next) => {
		await next(await mapper(value));
	};
}

function filter<A>(predicate: Lambda<[A], boolean>): Operate<A> {
	return async (value, next) => {
		if (!predicate(value)) {
			await next(value);
		}
	};
}

function find<A>(predicate: Lambda<[A], boolean>): Operate<A> {
	return async (value, next) => {
		if (predicate(value)) {
			await next(value);
		}
	};
}

export const Stream = {
	pipe,
  if: iif,
  tap,
	debounce,
	map,
	filter,
  find,
};
