import { assert, assertEquals } from "@std/assert";

import { Lambda } from "./lambda.ts";

Deno.test("lambda", async (test) => {
	await test.step("lambda.call", () => {
		let called = false;
		const lambda = () => (called = true);

		Lambda.call(lambda);

		assert(called);
	});

	await test.step("lambda.toggle", () => {
		assert(Lambda.toggle(false));
	});

	await test.step("lambda.combine", () => {
		const stack: number[] = [];

		const lambda = Lambda.combine(
			() => stack.push(0),
			() => stack.push(1),
		);

		lambda();

		assertEquals(stack, [0, 1]);
	});

	await test.step("lambda.compose", () => {
		const lambda = Lambda.compose(
			(number: number) => number + 2,
			(number: number) => number * 2,
		);

		const result = lambda(2);

		assertEquals(result, 8);
	});

	await test.step("lambda.merge", () => {
		const lambda = Lambda.merge(
			(number: number) => ({ sum: number + 2 }),
			(number: number) => ({ square: number * 2 }),
		);

		const result = lambda(2);

		assertEquals(result, { sum: 4, square: 4 });
	});

	await test.step("lambda.unpack.value", () => {
		const value: number = 0;
		const unpack = Lambda.unpack(value);

		assertEquals(unpack, value);
	});

	await test.step("lambda.unpack.lambda", () => {
		const value = (number: number) => number + 2;
		const unpack = Lambda.unpack(value, 2);

		assertEquals(unpack, 4);
	});

	await test.step("lambda.cache.value", () => {
		let called = 0;

		const cached = Lambda.cache((number: number) => {
			called++;
			return number;
		});

		cached(2);
		cached(2);

		assertEquals(called, 1);
	});

	await test.step("lambda.cache.reference", () => {
		let called = 0;

		const cached = Lambda.cache((object1: object, object2: object) => {
			called++;
			return { object1, object2 };
		});

		const object = {};

		cached(object, object);
		cached(object, object);

		assertEquals(called, 1);
	});
	
	// await test.step("lambda.debounce", async () => {
	// 	const stack: number[] = [];

	// 	const sum = Lambda.debounce(100)((number: number) => stack.push(number));

	// 	sum(1);
	// 	sum(2);

	// 	await Task.delay(500);

	// 	assertEquals(stack, [2]);
	// });
});
