import type { Struct } from "./struct/index.ts";

export type key = string | number | symbol;
export type keys = Array<string | number | symbol>;

export type Keys<T> = T extends Struct
	? {
			[K in keyof T]: [K] | [K, ...Keys<T[K]>];
	  }[keyof T]
	: T extends Array<unknown>
		? [number]
		: never;

export type Pull<T, K> = K extends [infer HEAD, ...infer TAIL] 
? (HEAD extends keyof T ? Pull<T[HEAD], TAIL> : never) 
: T;

export type Put<K, T> = K extends [infer HEAD, ...infer TAIL]
  ? HEAD extends key
    ? TAIL extends key[]
      ? { [KEY in HEAD]: Put<TAIL, T> }
      : { [KEY in HEAD]: T }
    : never
  : T;
    
export type Assigned<A, B> = Omit<A, keyof B> & B;

export type Expand<T> = T extends object
  ? T extends (...args: infer A) => infer R
    ? (...args: Expand<A>) => Expand<R>
    : T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;
  