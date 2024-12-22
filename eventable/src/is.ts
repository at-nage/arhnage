import { Is, Struct } from "@arhnage/std";

import { Emitter, $subscribers } from "./emitter/emitter.ts";

declare module "@arhnage/std" {
	interface IsGuards {
    emitter: <T>(struct: object | Emitter<T>) => struct is Emitter<T>;
	}
}

Struct.assign(
  Is,
  {
    emitter: Struct.has($subscribers),
  }
);
