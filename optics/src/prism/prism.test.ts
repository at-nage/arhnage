// deno-lint-ignore-file

import { Option, pipe, Struct } from "@arhnage/std";

import { Lens } from "../lens/index.ts";
import { Prism } from "./index.ts";

Deno.test("prism", async (test) => {
	await test.step("test", () => {
		const lens = Lens.property("counter");
		const prism = Prism.property("amount");

		const composed = Prism.create(
			(value: any): any => Lens.set(<Struct<"counter", unknown>>{}, Prism.build(value, prism), lens),
			(source: any): any =>
				pipe(
					Prism.get(source, prism),
					Option.bind((source) => Lens.get(source, lens)),
				),
		);
	});
});
