// deno-lint-ignore-file no-explicit-any

import { Lambda } from "../index.ts";
import { Is } from "../is/index.ts";
import { key } from "../types.ts";

import { Assign } from "./types.ts";

export type Struct<K extends keyof any = string, T = any> = {
	[P in K]: T;
};

interface Has {
	<K extends key, V>(struct: object, key: K, value?: V): struct is Struct<K, V>;
	<K extends key, V>(key: K, value?: V): (struct: object) => struct is Struct<K, V>;
}

const has = <Has>Lambda.fflip(<K extends key, V>(struct: object, key: K, value?: V): struct is Struct<K, V> => {
	if (Is.undefined(value)) {
		return Object.hasOwn(struct, key);
	}

	return Object.hasOwn(struct, key) && struct[key as keyof object] === value;
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
