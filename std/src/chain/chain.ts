import { Is } from "../index.ts";
import { Lambda } from "../index.ts";

import { Iter } from "./types.ts";

export type Chain<T> = T | T[];

const iter: Iter = Lambda.fflip((chain: Chain<unknown>, lambda: Lambda<[value: unknown], void>) => {
	if (!Is.array(chain)) {
		return lambda(chain);
	}

	for (const element of chain) {
		lambda(element);
	}
});

export const Chain = {
	iter,
};
