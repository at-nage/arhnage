import { Is } from "@arhnage/std";

import { Renderable } from "../jsx/renderable/index.ts";
import { RenderOptions } from "./types.ts";

export function render(options: RenderOptions) {
	let { container, component } = options;

	if (Is.string(container)) {
		container = document.querySelector<HTMLElement>(container);
	}

	if (!container) {
		throw new Error("container not found");
	}

  Renderable.render(container, component);
}
