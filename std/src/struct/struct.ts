// deno-lint-ignore-file no-explicit-any

import { Lambda } from "../index.ts";
import { Is } from "../is/index.ts";
import { key } from "../types.ts";

import { Assign, Has } from "./types.ts";

export type Struct<K extends key = key, T = any> = {
	[P in K]: T;
};

const has = <Has>Lambda.fflip((struct: Struct, key: key, value: unknown | undefined = undefined): struct is Struct => {
	if (!Is.object(struct)) return false

	if (Is.undefined(value)) {
		return Object.hasOwn(struct, key);
	}

	return Object.hasOwn(struct, key) && struct[key] === value;
});

function keys<T>(object: T): Array<string | symbol> {
	return [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
}

const assign: Assign = (first: any, ...objects: any[]): any => {
	return objects.reduce((previous, current) => {
		if (Is.undefined(current) || Is.null(current)) return previous;

		for (const key of Struct.keys(current)) {
			const pVal = previous[key];
			const oVal = current[key];

			if (Is.array(pVal) && Is.array(oVal)) {
				previous[key] = pVal.concat(oVal);
			} else if (Is.object(pVal) && Is.object(oVal)) {
				previous[key] = assign(pVal, oVal);
			} else {
				previous[key] = oVal;
			}
		}

		return previous;
	}, first);
};

export const Struct = {
	has,
	keys,
	assign,
};
