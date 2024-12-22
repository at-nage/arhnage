import type { Lambda } from "../lambda/index.ts";
import type { Chain } from "./chain.ts";

export interface Iter {
  <T>(chain: Chain<T>, lambda: Lambda<[value: T], void>): void;
  <T>(lambda: Lambda<[value: T], void>): (chain: Chain<T>) => void;
}
