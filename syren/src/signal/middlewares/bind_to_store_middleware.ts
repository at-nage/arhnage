import { Emitter } from "@arhnage/eventable";
import { Keys, Pull, Tail } from "@arhnage/std";

import { Store } from "../../store/index.ts";

import { Signal } from "../signal.ts";

export function bind_to_store_middleware<T, K extends [number, ...Keys<T>]>(store: Store<T>, keys: K) {
	return (signal: Signal<Pull<T, Tail<K>>>) => {
		Signal.set(signal, Store.get(store, keys));
		Emitter.subscribe(signal, "changed", (value) => {
			Store.insert(store, keys, value);
		});
	};
}
