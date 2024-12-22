import { Is, Struct, Type } from "@arhnage/std";

import { $signal, Signal } from "./signal/signal.ts";
import { $slice, Slice } from "./slice/slice.ts";
import { $store, Store } from "./store/store.ts";

declare module "@arhnage/std" {
	interface IsGuards {
    signal: <A, V>(value: A | Signal<V>) => value is Signal<V>;
    store: <A, V>(value: A | Store<V>) => value is Store<V>;
    slice: <A, V>(value: A | Slice<V>) => value is Slice<V>;
	}
}

Struct.assign(
  Is,
  {
    signal: Type.has($signal),
    store: Type.has($store),
    slice: Type.has($slice),
  }
);
