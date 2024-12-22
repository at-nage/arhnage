import { Lambda } from "@arhnage/std";

import { Html } from "../../html/index.ts";

const $render = Symbol.for("render");
type $render = typeof $render;

export type Renderable = {
	[$render]: Lambda<[container: Html.Element], Lambda<[], void>>;
};

function is(renderable: object): renderable is Renderable {
	return Object.hasOwn(renderable, $render);
}

function create(render: Renderable[$render]) {
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
 