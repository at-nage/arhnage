import { assertEquals } from "@std/assert";

import { Lens } from "./index.ts";
import { pipe } from "@arhnage/std";
import { Keys } from "../types.ts";

interface Counter {
	count: number;
}

interface State {
	counter: Counter;
}

Deno.test("lens", async (test) => {
	const count = Lens.property("count");

	const counter = Lens.create<"counter">(
		(source) => {
			return source.counter;
		},
		(source, value) => {
			source.counter = value;
			return source;
		},
	);

	const state: State = {
		counter: {
			count: 0,
		},
	};

	const lens = Lens.compose(counter, count);

	await test.step("should return value", () => {
		const result = Lens.get(lens, state);
		assertEquals(result, state.counter.count);
	});

	await test.step("should set value", () => {
		const value = state.counter.count + 1;
		Lens.set(lens, state, value);
		assertEquals(state.counter.count, value);
	});

	await test.step("should over a value", () => {
		const value = state.counter.count + 1;
		Lens.over(lens, state, (value) => value + 1);
		assertEquals(state.counter.count, value);
	});
});

Deno.test("lens types", () => {
	const first = { context: 0 };
	const second = { context: "zero" };

	const counter = Lens.property("context");

	const first_context = Lens.get(counter, first);
	const second_context = Lens.get(counter, second);

	assertEquals(first.context, first_context);
	assertEquals(second.context, second_context);
});
