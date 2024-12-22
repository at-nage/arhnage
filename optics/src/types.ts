import type { key } from "@arhnage/std";
import { Struct } from "@arhnage/std";

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
