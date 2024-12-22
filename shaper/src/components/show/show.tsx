import { Signal } from "@arhnage/syren";

import { Renderable } from "../../runtime/jsx/renderable/renderable.ts";
import { Strategy } from "../../runtime/jsx/strategy/index.ts";
import { JSX } from "../../runtime/jsx/types/index.ts";

export interface ShowProps {
	children: Array<JSX.Child>;
	when: Signal<boolean>;
}

export const Show = ({ when, children }: ShowProps): JSX.Children => {
	return Renderable.create((container) =>
		Signal.effect(
			(show) => {
				if (!show) return;
				return Strategy.mount(container, children);
			},
			[when]
		),
	);
};
