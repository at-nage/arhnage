import { Html } from "../../html/index.ts";

import { Renderable } from "../renderable/renderable.ts";
import { JSX } from "../types/index.ts";

export const renderable_strategy = {
	is: Renderable.is,
	create: (container: Html.Element, child: JSX.Element) => {
    return Renderable.render(container, child);
  },
};
