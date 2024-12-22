import { Cleanup } from "@arhnage/std";

import { $value, Store } from "./store.ts";

type Value<S extends Store> = S[$value][number];

export type Args<S extends Store[]> = { [K in keyof S]: Value<S[K]> };

export interface Get {
  (index: number): <T>(source: Store<T>) => T;
  <T>(source: Store<T>, index: number): T;
  <T>(source: Store<T>): T[];
}

export interface Set {
  <T>(index: number, value: T, equal?: (left: T, right: T) => boolean): (source: Store<T>) => Store<T>;
  <T>(store: Store<T>, index: number, value: T, equal?: (left: T, right: T) => boolean): Store<T>;
}

export interface Iter {
  <T>(lambda: (value: T, index: number) => void): (source: Store<T>) => Store<T>;
  <T>(store: Store<T>, lambda: (value: T, index: number) => void): Store<T>;
}

export interface Over {
  <T>(index: number, lambda: (value: T) => T, equal?: (left: T, right: T) => boolean): (source: Store<T>) => Store<T>;
  <T>(store: Store<T>, index: number, lambda: (value: T) => T, equal?: (left: T, right: T) => boolean): Store<T>;
}

export interface Map {
  <T>(lambda: (value: T, index: number) => T, equal?: (left: T, right: T) => boolean): (source: Store<T>) => Store<T>;
  <T>(store: Store<T>, lambda: (value: T, index: number) => T, equal?: (left: T, right: T) => boolean): Store<T>;
}

export interface Subscribe {
  <T>(listener: (index: number, value: T) => void): (source: Store<T>) => Cleanup;
  <T>(store: Store<T>, listener: (index: number, value: T) => void): Cleanup;
}

export interface Effect {
  <S extends Store>(listener: (index: number, value: Value<S>) => void | Cleanup, stores: [S]): Cleanup;
  <S1 extends Store, S2 extends Store>(listener: (index: number, arg_1: Value<S1>, arg_2: Value<S2>) => void | Cleanup, stores: [S1, S2]): Cleanup;
  <S1 extends Store, S2 extends Store, S3 extends Store>(
    listener: (index: number, arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>) => void | Cleanup,
    stores: [S1, S2, S3],
  ): Cleanup;
  <S1 extends Store, S2 extends Store, S3 extends Store, S4 extends Store>(
    listener: (index: number, arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>) => void | Cleanup,
    stores: [S1, S2, S3, S4],
  ): Cleanup;
  <S1 extends Store, S2 extends Store, S3 extends Store, S4 extends Store, S5 extends Store>(
    listener: (index: number, arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>, arg_5: Value<S5>) => void | Cleanup,
    stores: [S1, S2, S3, S4, S5],
  ): Cleanup;
  <S1 extends Store, S2 extends Store, S3 extends Store, S4 extends Store, S5 extends Store, S6 extends Store>(
    listener: (index: number, arg_1: Value<S1>, arg_2: Value<S2>, arg_3: Value<S3>, arg_4: Value<S4>, arg_5: Value<S5>, arg_6: Value<S6>) => void | Cleanup,
    stores: [S1, S2, S3, S4, S5, S6],
  ): Cleanup;
  <S extends Store[]>(listener: (index: number, ...args: Args<S>) => void | Cleanup, stores: S): Cleanup;
}
