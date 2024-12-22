import type { Assigned, Expand, key } from "../types.ts";

import { Struct } from "./struct.ts";

export interface Has {
	<K extends key, V>(key: K, value?: V): (struct: object) => struct is Struct<K, V>;
	<K extends key, V>(struct: object, key: K, value?: V): struct is Struct<K, V>;
}

export type Assign = {
  <A, B>(first: A, second: B): Expand<Assigned<A, B>>;
	<A, B, C>(first: A, second: B, third: C): Expand<Assigned<A, Assigned<B, C>>>;
	<A, B, C, D>(first: A, second: B, third: C, fourth: D): Expand<Assigned<A, Assigned<B, Assigned<C, D>>>>;
}
