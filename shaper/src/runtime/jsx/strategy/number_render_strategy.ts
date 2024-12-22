import { Is } from "@arhnage/std";

import { Html } from "../../html/index.ts";

export const number_render_strategy = {
	is: Is.number,
	create: (container: Html.Element, child: number) => {
    const node = document.createTextNode(child.toString());
		container.appendChild(node);
		return () => container.removeChild(node);
  },
};
