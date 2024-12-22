import { Is } from "@arhnage/std";

import { Html } from "../../html/index.ts";

export const string_render_strategy = {
	is: Is.string,
	create: (container: Html.Element, child: number) => {
		const node = document.createTextNode(child.toString());
		container.appendChild(node);
		return () => container.removeChild(node);
	},
};
