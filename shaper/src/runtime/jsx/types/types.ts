import { Lambda } from "@arhnage/std";
import { Signal } from "@arhnage/syren";

import { Component } from "../component/index.ts";
import { Node } from "../node/index.ts";

import { PickMutable } from "./utils.ts";
import { Html } from "../../html/index.ts";

export type Elements = Array<Element>;
export type Element = Node | Component /*| Render | Text  | Slot*/;

export type Children = Child | Array<Child>;
export type Child =
	| null
	| undefined
	| string
	| number
	| Element
	| Elements
	| Signal<string>
	| Signal<number>
	| Signal<null | string>
	| Signal<null | number>
	| Signal<undefined | string>
	| Signal<undefined | number>
	| Signal<null | undefined | string>
	| Signal<null | undefined | number>;

type Cleanup = Lambda<[], void>;

export type Api = {
	use: (using: Lambda<[], void | Cleanup>) => void;
	memo: <T>(memoize: () => T) => T;
};

export interface ChildrenProps {
	children?: Children;
}

export type FC<P = ChildrenProps> = (props: P, api: Api) => Children;

interface Props {
	class: string | undefined;
	["bind:class"]: Signal<string>;
	ref: Signal<HTMLElement | null>;
	children: Child | Children;
}

type EventMap<T> = {
	[K in keyof HTMLElementEventMap as `on:${K & string}`]: Lambda<
		[
			event: Omit<HTMLElementEventMap[K], "target"> & {
				target: T;
			},
		],
		void
	>;
};

type BindProps<T> = {
	[K in keyof PickMutable<T> as `bind:${K & string}`]: Signal<T[K]>;
};

type ElementProps<T> = Partial<Props & PickMutable<Omit<T, "className">> & EventMap<T> & BindProps<Omit<T, "className">>>;

// end types

export type HtmlElementTagMap = {
	[K in keyof HTMLElementTagNameMap]: ElementProps<HTMLElementTagNameMap[K]>;
};

// export type SvgElementTagMap = {
// 	[K in keyof SVGElementTagNameMap]: ElementProps<SVGElementTagNameMap[K]>;
// };

export type MathElementTagMap = {
	[K in keyof MathMLElementTagNameMap]: ElementProps<MathMLElementTagNameMap[K]>;
};

// element tag map

export interface IntrinsicAttributes {
	// key?: any;
	ref?: Signal<Html.Element>;
}

export interface IntrinsicElements extends HtmlElementTagMap, /*SvgElementTagMap,*/ MathElementTagMap {}
