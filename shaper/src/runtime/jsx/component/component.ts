import { Cleanup, Is, Lambda, Struct } from "@arhnage/std";

import { Renderable } from "../renderable/index.ts";
import { JSX } from "../types/index.ts";
import { Strategy } from "../strategy/index.ts";

export type Component = Renderable;

function usable() {
	const usings: Array<Lambda<[], void | Cleanup>> = [];
	const cleanups: Array<Cleanup> = [];

	function use(using: Lambda<[], void | Cleanup>) {
		usings.push(using);
	}

	function run() {
		for (const using of usings) {
			const cleanup = using();
			if (cleanup) cleanups.push(cleanup);
		}

		usings.length = 0;
		
		return () => {
			for (const cleanup of cleanups) {
				cleanup();
			}

			cleanups.length = 0;
		};
	}

	return { use, run };
}

function memoization() {
	const state = {
		index: 0,
		array: new Array<unknown>(),
	};

	function increment() {
		return state.index++;
	}

	function clear() {
		state.index = 0;
	}

	function memo<T>(memoize: () => T) {
		return (state.array[increment()] ??= memoize()) as T;
	}

	return { memo, clear };
}

export const create = (tag: JSX.FC, properties: Struct<string, unknown>, children: Array<JSX.Child>): Component => {
	console.log("create", tag.name, properties, children);

	// @ts-expect-error do not know how to type this properly
	children = Is.array(children, 1) && Is.lambda(children[0]) 
		? children[0] 
		: children;

	const { use, run } = usable();
	const { memo, clear } = memoization();

	return Struct.assign(
		{ name: tag.name },
		Renderable.create((container) => {
			const element = tag(Struct.assign({ children }, properties), { use, memo });

			return Lambda.combine(
				Strategy.mount(container, [element]),
				run(),
				clear,
			);
		}),
	);
};

export const Component = {
	create,
};
