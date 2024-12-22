import { Lambda } from "../lambda/index.ts";
import { Lazy } from "../lazy/index.ts";

import { Pipe } from "./types.ts";

export const pipe: Pipe = <T>(initial: Lazy<T>, ...lambdas: Lambda<[T], T>[]): T => {
	return lambdas.reduce((value, action) => action(value), Lazy.get(initial));
};
