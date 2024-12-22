import { Assigned, Expand } from "../types.ts";

export type Assign = {
  <A, B>(first: A, second: B): Expand<Assigned<A, B>>;
	<A, B, C>(first: A, second: B, third: C): Expand<Assigned<A, Assigned<B, C>>>;
	<A, B, C, D>(first: A, second: B, third: C, fourth: D): Expand<Assigned<A, Assigned<B, Assigned<C, D>>>>;
}
