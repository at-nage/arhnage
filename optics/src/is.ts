import { Is, keys, Struct, Type } from "@arhnage/std";

import { $lens, Lens } from "./lens/lens.ts";
import { $prism, Prism } from "./prism/prism.ts";

declare module "@arhnage/std" {
	interface IsGuards {
    lens: <K extends keys>(struct: object | Lens<K>) => struct is Lens<K>;
		prism: <K extends keys>(struct: object | Prism<K>) => struct is Prism<K>;
	}
}

Struct.assign(
  Is,
  {
    lens: Type.has($lens),
    prism: Type.has($prism),
  }
);
