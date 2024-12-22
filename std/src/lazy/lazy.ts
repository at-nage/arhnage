import { Is } from "../is/index.ts";
import { Lambda } from "../lambda/index.ts";

export type Lazy<A> = A | Lambda<[], A>;

function get<A>(value: Lazy<A>) {
  return Is.lambda(value) ? value() : value;
}

export const Lazy = {
  get,
}
