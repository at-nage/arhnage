import type { keys } from "@arhnage/std";

import type { Keys, Pull } from "../types.ts";

import type { Lens } from "./lens.ts";

export interface Get {
	<S>(source: S): <K extends Keys<S>>(lens: Lens<K>) => Pull<S, K>;
	<S, K extends Keys<S>>(lens: Lens<K>, source: S): Pull<S, K>;
}

export interface Set {
	<S, K extends Keys<S>>(source: S, value: Pull<S, K>): (lens: Lens<keys>) => S;
	<S, K extends Keys<S>>(lens: Lens<K>, source: S, value: Pull<S, K>): S
}

export interface Over {
	<S, K extends Keys<S>>(source: S, lambda: (value: Pull<S, K>) => Pull<S, K>): (lens: Lens<keys>) => S;
	<S, K extends Keys<S>>(lens: Lens<K>, source: S, lambda: (value: Pull<S, K>) => Pull<S, K>): S
}

export type Compose = {
	<K1 extends keys, K2 extends keys>(lens1: Lens<K1>, lens2: Lens<K2>): Lens<[...K1, ...K2]>;
	<K1 extends keys, K2 extends keys, K3 extends keys>(lens1: Lens<K1>, lens2: Lens<K2>, lens3: Lens<K3>): Lens<[...K1, ...K2, ...K3]>;
	<K1 extends keys, K2 extends keys, K3 extends keys, K4 extends keys>(
		lens1: Lens<K1>,
		lens2: Lens<K2>,
		lens3: Lens<K3>,
		lens4: Lens<K4>,
	): Lens<[...K1, ...K2, ...K3, ...K4]>;
};
