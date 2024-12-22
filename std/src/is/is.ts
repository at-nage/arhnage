// deno-lint-ignore-file

import { Lambda } from "../lambda/lambda.ts";
import { key } from "../types.ts";

export interface IsGuards {
	object: (value: unknown) => value is object;
	undefined: (value: unknown) => value is undefined;
	null: (value: unknown) => value is null;
	string: (value: unknown) => value is string;
	symbol: (value: unknown) => value is symbol;
	empty: (value: unknown) => value is "";
	number: (value: unknown) => value is number;
	lambda: (value: unknown) => value is Lambda;
	promise: (value: unknown) => value is Promise<any>;
	array: {
		<T>(value: unknown | Array<T>): value is Array<T>;
		<T>(value: unknown | Array<T>, length: 1): value is [T];
		<T>(value: unknown | Array<T>, length: number): value is Array<T>;
	};
	key: (value: unknown) => value is key;
}

export type Is = IsGuards;

export const Is = <IsGuards>{
	object: (value) => typeof value === "object",
	undefined: (value) => typeof value === "undefined",
	null: (value) => value === null,
	string: (value) => typeof value === "string",
	symbol: (value) => typeof value === "symbol",
	empty: (value) => value === "",
	number: (value) => typeof value === "number",
	lambda: (value) => typeof value === "function",
	promise: (value) => value instanceof Promise,
	array: <T>(value: unknown | Array<T>, length?: number) => {
		if (length) {
			return Array.isArray(value) && value.length === length;
		}

		return Array.isArray(value);
	},
	key: (value) => Is.string(value) || Is.number(value) || Is.symbol(value),
};
