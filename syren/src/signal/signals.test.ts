import { assertEquals } from "@std/assert/equals";
import { assertFalse } from "@std/assert/false";

import { Signal } from "./signal.ts";

Deno.test("signal", async (test) => {
	const count = Signal.create(0);
	
	await test.step("should return value", () => {
		const result = Signal.get(count);
		assertEquals(result, 0);
	});
	
	await test.step("should over a value", () => {
    let listened = false;

		Signal.subscribe(count, () => listened = true);

		Signal.set(count, 1);
		const result = Signal.get(count);

		assertEquals(result, 1);
    assertFalse(!listened);
	});	
});
