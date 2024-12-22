import { Lambda } from "@arhnage/std";

import { Html } from "../../html/index.ts";
import { Is } from "@arhnage/std";

const $render = Symbol.for("render");
type $render = typeof $render;

export type Renderable = {
	[$render]: Lambda<[container: Html.Element], Lambda<[], void>>;
};

function is(renderable: object): renderable is Renderable {
	return Is.object(renderable) && Object.hasOwn(renderable, $render);
}

function create(render: Renderable[$render]): Renderable {
	return { [$render]: render };
}

function render(container: Html.Element, renderable: Renderable) {
	return renderable[$render](container);
}

export const Renderable = {
	is,
	create,
	render,
};
 