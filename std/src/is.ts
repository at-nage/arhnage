import { Is, Struct, Type } from "./index.ts";

import { $abort, Abort } from "./abort/abort.ts";
import { $none, $some, None, Some } from "./option/option.ts";

declare module "./index.ts" {
	interface IsGuards {
		abort: (struct: object) => struct is Abort;
    none: (option: unknown) => option is None;
    some: <V>(option: unknown) => option is Some<V>;
	}
}

Struct.assign(
  Is,
  {
    abort: Type.has($abort),
    none: Type.has($none),
    some: Type.has($some),
  }
);
