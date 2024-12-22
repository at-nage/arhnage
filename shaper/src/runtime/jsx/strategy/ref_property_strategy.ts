import { Is } from "@arhnage/std";
import { Signal } from "@arhnage/syren";

import { Html } from "../../html/index.ts";

export const ref_property_strategy = {
	is: (_: HTMLElement, key: unknown, value: unknown) => Is.string(key) && key === "ref" && Is.object(value) && Is.signal(value),
	create: (element: HTMLElement, _: unknown, value: Signal<Html.Element | null>) => {
		if (Is.signal(value)) {
			Signal.set(value, element);
		}
	},
};
