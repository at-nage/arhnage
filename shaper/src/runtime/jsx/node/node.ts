import { Lambda, Struct } from "@arhnage/std";

import { Renderable } from "../renderable/index.ts";
import { JSX } from "../types/index.ts";
import { Strategy } from "../strategy/index.ts";

export type Node = Renderable;

const create = (tag: string, properties: Struct<string, unknown>, children: Array<JSX.Child>): Node => {
	console.log("create", tag, properties, children);

	return Struct.assign(
		{ name: tag },
		Renderable.create((container) => {
			const element = document.createElement(tag);

			container.appendChild(element);
			
			return Lambda.combine(
				Strategy.mount(element, children),
				Strategy.property(element, properties),
				() => container.removeChild(element),
			);
		}),
	);
};

export const Node = {
	create,
};
