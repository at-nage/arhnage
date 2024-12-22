import type { keys, Option } from "@arhnage/std";

import type { Lens } from "../lens/index.ts";
import type { Keys, Pull, Put } from "../types.ts";

import type { Prism } from "./prism.ts";

export interface Build {
	<S extends Put<K, unknown>, K extends keys>(value: Pull<S, K>): (prism: Prism<K>) => S;
	<S extends Put<K, unknown>, K extends keys>(prism: Prism<K>, value: Pull<S, K>): S;
}

export interface Get {
	<S>(source: S): <K extends Keys<S>>(prism: Prism<K>) => Option<Pull<S, K>>;
	<S, K extends Keys<S>>(prism: Prism<K>, source: S): Option<Pull<S, K>>;
}

export interface Set {
	<S, K extends Keys<S>>(source: S, value: Pull<S, K>): (prism: Prism<K>) => S;
	<S, K extends Keys<S>>(prism: Prism<K>, source: S, value: Pull<S, K>): S;
}

export interface Over {
	<S, K extends Keys<S>>(source: S, lambda: (value: Pull<S, K>) => Pull<S, K>): (prism: Prism<K>) => S;
	<S, K extends Keys<S>>(prism: Prism<K>, source: S, lambda: (value: Pull<S, K>) => Pull<S, K>): S;
}

export type Compose = {
	<K1 extends keys, K2 extends keys>(prism1: Prism<K1>, prism2: Prism<K2>): Prism<[...K1, ...K2]>;
	<K1 extends keys, K2 extends keys>(lens: Lens<K1>, prism: Prism<K2>): Prism<[...K1, ...K2]>;

	<K1 extends keys, K2 extends keys, K3 extends keys>(prism1: Prism<K1>, prism2: Prism<K2>, prism3: Prism<K3>): Prism<[...K1, ...K2, ...K3]>;
	<K1 extends keys, K2 extends keys, K3 extends keys>(lens1: Lens<K1>, prism2: Prism<K2>, prism3: Prism<K3>): Prism<[...K1, ...K2, ...K3]>;
	<K1 extends keys, K2 extends keys, K3 extends keys>(lens1: Lens<K1>, lens2: Lens<K2>, prism3: Prism<K3>): Prism<[...K1, ...K2, ...K3]>;

	<K1 extends keys, K2 extends keys, K3 extends keys, K4 extends keys>(prism1: Prism<K1>, prism2: Prism<K2>, prism3: Prism<K3>, prism4: Prism<K4>): Prism<
		[...K1, ...K2, ...K3, ...K4]
	>;
	<K1 extends keys, K2 extends keys, K3 extends keys, K4 extends keys>(lens1: Lens<K1>, prism2: Prism<K2>, prism3: Prism<K3>, prism4: Prism<K4>): Prism<
		[...K1, ...K2, ...K3, ...K4]
	>;
	<K1 extends keys, K2 extends keys, K3 extends keys, K4 extends keys>(lens1: Lens<K1>, lens2: Lens<K2>, prism3: Prism<K3>, prism4: Prism<K4>): Prism<
		[...K1, ...K2, ...K3, ...K4]
	>;
	<K1 extends keys, K2 extends keys, K3 extends keys, K4 extends keys>(lens1: Lens<K1>, lens2: Lens<K2>, lens3: Lens<K3>, prism4: Prism<K4>): Prism<
		[...K1, ...K2, ...K3, ...K4]
	>;
};
