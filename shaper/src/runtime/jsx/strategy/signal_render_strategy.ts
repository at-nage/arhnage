import { Is, Lambda } from "@arhnage/std";
import { Signal } from "@arhnage/syren";

import { Html } from "../../html/index.ts";

export const signal_render_strategy = {
	is: Is.signal,
	create: (container: Html.Element, child: Signal<string | number | unknown>) => {
		const node = document.createTextNode("");

		const attach = (value: unknown) => {
			if (Is.string(value)) {
				node.textContent = value;
				return;
			}
			if (Is.number(value)) {
				node.textContent = value.toString();
				return;
			}
			if (Is.undefined(value) || Is.null(value)) {
				node.textContent = "";
				return;
			}
		};

		container.appendChild(node);

		return Lambda.combine(
			Signal.subscribe(child, attach),
			() => container.removeChild(node)
		);
	},
};
