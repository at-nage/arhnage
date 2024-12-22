import { signal, Store, store } from "@arhnage/syren";
import { Emitter } from "@arhnage/eventable";

const array = store(["one", "two", "three"]);

const one = signal(Store.get(array, 0));
Emitter.subscribe(one, "changed", (value) => Store.set(array, 0, value));

