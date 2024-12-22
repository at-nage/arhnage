import type { key, Struct } from "@arhnage/std";

import type { Slice } from "./slice.ts";

export interface Get {
  <K extends key>(key: K): <T extends Struct<K, unknown>>(source: Slice<T>) => T[K];
  <T, K extends keyof T>(source: Slice<T>, key: K): T[K];
  <T>(source: Slice<T>): T;
}

export interface Set {
  <T, K extends keyof T>(index: K, value: T, equal?: (left: T, right: T) => boolean): (source: Slice<T>) => Slice<T>;
  <T, K extends keyof T>(store: Slice<T>, index: K, value: T, equal?: (left: T, right: T) => boolean): Slice<T>;
}
