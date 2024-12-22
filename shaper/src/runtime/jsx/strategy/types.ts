import { Lambda } from "@arhnage/std";
import { Html } from "../../html/index.ts";
import { JSX } from "../types/index.ts";

export interface RenderStrategy {
	is: (children: unknown) => boolean;
	create: (container: Html.Element, children: JSX.Children) => void | Lambda<[], void>;
}

export interface PropertyStrategy {
	is: (element: Html.Element, key: unknown, value: unknown) => boolean;
	create: (element: Html.Element, key: unknown, value: unknown) => void | Lambda<[], void>;
}
