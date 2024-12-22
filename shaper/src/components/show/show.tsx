import { Signal } from "@arhnage/syren";

import { Renderable } from "../../runtime/jsx/renderable/renderable.ts";
import { Strategy } from "../../runtime/jsx/strategy/index.ts";
import { JSX } from "../../runtime/jsx/types/index.ts";

export interface ShowProps {
	children: Array<JSX.Child>;
	not?: boolean;
	when: Signal<boolean>;
}

/*
not		 when		result
false  false  false
false  true   true
true   false  true
true   true   false
*/

export const Show = ({ not = false, when, children }: ShowProps): JSX.Children => {
	return Renderable.create((container) =>
		Signal.effect(
			(show) => {
				if (not !== show) return;
				return Strategy.mount(container, children);
			},
			[when]
		),
	);
};
