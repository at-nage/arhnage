// deno-lint-ignore-file

import type { Abort } from "../abort/index.ts";
import type { Task } from "../task/index.ts";
import type { Lambda } from "./lambda.ts";

export type Cleanup = Lambda<[], void>;

export type Arguments<T extends Lambda> = T extends {
	(...args: infer P1): any;
	(...args: infer P2): any;
	(...args: infer P3): any;
	(...args: infer P4): any;
}
	? P1 | P2 | P3 | P4
	: T extends { (...args: infer P1): any; (...args: infer P2): any; (...args: infer P3): any }
	? P1 | P2 | P3
	: T extends { (...args: infer P1): any; (...args: infer P2): any }
	? P1 | P2
	: T extends (...args: infer P) => any
	? P
	: never;

export type Returns<T extends Lambda> = T extends {
	(...args: any[]): infer R1;
	(...args: any[]): infer R2;
	(...args: any[]): infer R3;
	(...args: any[]): infer R4;
}
	? R1 | R2 | R3 | R4
	: T extends { (...args: any[]): infer R1; (...args: any[]): infer R2; (...args: any[]): infer R3 }
	? R1 | R2 | R3
	: T extends { (...args: any[]): infer R1; (...args: any[]): infer R2 }
	? R1 | R2
	: T extends (...args: any[]) => infer R
	? R
	: never;
	
export type Head<T extends any[]> = T extends [infer F, ...infer I] 
	? F
	: T extends [(infer F)?, ...infer I]
		? F | undefined
		: never

export type Tail<T extends any[]> = T extends [infer F, ...infer I] 
? I
: T extends [(infer F)?, ...infer I]
	? I
	: []

export type Last<T extends any[]> = T extends [...infer I, infer L]
	? L
	: T extends [...infer I, (infer L)?]
		? L | undefined
		: never

export interface Compose {
	<A, B, C>(first: Lambda<[A], B>): Lambda<[A], B>;
	<A, B, C>(first: Lambda<[A], B>, second: Lambda<[B], C>): Lambda<[A], C>;
	<A, B, C, D>(first: Lambda<[A], B>, second: Lambda<[B], C>, third: Lambda<[C], D>): Lambda<[A], D>;
	<A, B, C, D, E>(first: Lambda<[A], B>, second: Lambda<[B], C>, third: Lambda<[C], D>, fourth: Lambda<[D], E>): Lambda<[A], E>;
	<A, B, C, D, E, F>(first: Lambda<[A], B>, second: Lambda<[B], C>, third: Lambda<[C], D>, fourth: Lambda<[D], E>, fifth: Lambda<[D], F>): Lambda<[A], F>;
	<A, B, C, D, E, F, G>(
		first: Lambda<[A], B>,
		second: Lambda<[B], C>,
		third: Lambda<[C], D>,
		fourth: Lambda<[D], E>,
		fifth: Lambda<[E], F>,
		sixth: Lambda<[F], G>,
	): Lambda<[A], G>;
}

export interface Merge {
	<A, B, C>(first: Lambda<[A], B>, second: Lambda<[A], C>): Lambda<[A], B & C>;
	<A, B, C, D>(first: Lambda<[A], B>, second: Lambda<[A], C>, third: Lambda<[A], D>): Lambda<[A], B & C & D>;
	<A, B, C, D, E>(first: Lambda<[A], B>, second: Lambda<[A], C>, third: Lambda<[A], D>, fourth: Lambda<[A], E>): Lambda<[A], B & C & D & E>;
	<A, B, C, D, E, F>(
		first: Lambda<[A], B>,
		second: Lambda<[A], C>,
		third: Lambda<[A], D>,
		fourth: Lambda<[A], E>,
		fifth: Lambda<[A], B & C & D & E & F>,
	): Lambda<[A], F>;
	<A, B, C, D, E, F>(
		first: Lambda<[A], B>,
		second: Lambda<[A], C>,
		third: Lambda<[A], D>,
		fourth: Lambda<[A], E>,
		fifth: Lambda<[A], F>,
		sixth: Lambda<[A], F>,
	): Lambda<[A], B & C & D & E & F & F>;
}

export interface DebounceOptions {
	abort?: Abort;
	onerror?: () => void
}

export interface Debounce {
	(delay: number, options?: DebounceOptions): <A extends unknown[], R>(lambda: Lambda<A, R>) => (...args: A) => Promise<R>;
	<A extends unknown[], R extends Task>(lambda: Lambda<A, R>, delay: number, options?: DebounceOptions): (...args: A) => R;
	<A extends unknown[], R>(lambda: Lambda<A, R>, delay: number, options?: DebounceOptions): (...args: A) => Promise<R>;
}
