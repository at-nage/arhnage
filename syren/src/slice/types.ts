import type { Cleanup, key, Struct } from "@arhnage/std";

import type { Slice } from "./slice.ts";

export interface Get {
  <K extends key>(key: K): <T extends Struct<K, unknown>>(source: Slice<T>) => T[K];
  <T, K extends keyof T>(source: Slice<T>, key: K): T[K];
  <T>(source: Slice<T>): T;
}

export interface Set {
  <T, K extends keyof T>(key: K, value: T[K], equal?: (left: T[K], right: T[K]) => boolean): (source: Slice<T>) => Slice<T>;
  <T, K extends keyof T>(store: Slice<T>, key: K, value: T[K], equal?: (left: T[K], right: T[K]) => boolean): Slice<T>;
}

export interface Over {
  <T, K extends keyof T>(key: K, lambda: (value: T[K]) => T[K], equal?: (left: T[K], right: T[K]) => boolean): (source: Slice<T>) => Slice<T>;
  <T, K extends keyof T>(store: Slice<T>, key: K, lambda: (value: T[K]) => T[K], equal?: (left: T[K], right: T[K]) => boolean): Slice<T>;
}

export interface Subscribe {
  <T>(listener: <K extends keyof T>(key: K, value: T[K]) => void): (source: Slice<T>) => Cleanup;
  <T>(store: Slice<T>, listener: <K extends keyof T>(key: K, value: T[K]) => void): Cleanup;
}
