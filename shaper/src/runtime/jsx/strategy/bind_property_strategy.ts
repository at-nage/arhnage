import { Is } from "@arhnage/std";
import { Signal } from "@arhnage/syren";

import { Html } from "../../html/index.ts";

export const bind_property_strategy = {
	is: (_: Html.Element, key: unknown, value: unknown) => Is.string(key) && key.startsWith("bind:") && Is.object(value) && Is.signal(value),
	create: (element: Html.Element, key: string, signal: Signal<string | number | undefined>) => {
		key = key.substring(5);
		

		if (key === "class") {
			return Signal.subscribe(signal, (value) => {
				if (Is.string(value)) {
					element.className = value;
				}
			});
		}

		if (key in element) {
			return Signal.subscribe(signal, (value) => {
				// @ts-expect-error somehow string can not be a key
				element[key] = value;
			});
		}


		return Signal.subscribe(signal, (value) => {
			if (Is.undefined(value)) return;
			element.setAttribute(key, value.toString());
		});
	},
};
