import { Is, Struct } from "@arhnage/std";

import { Component } from "./component/index.ts";
import { Node } from "./node/index.ts";
import { JSX } from "./types/index.ts";

export function h(tag: JSX.FC | string, properties: Struct<string, unknown> | null, ...children: Array<JSX.Child>) {
	properties ??= {};
	children = children.flat(Infinity);

	return Is.lambda(tag) 
		? Component.create(tag, properties, children) 
		: Node.create(tag, properties, children);
}

export const f: JSX.FC = ({ children }) => children;
