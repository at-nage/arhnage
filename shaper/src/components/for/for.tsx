import { Cleanup, Is, Lambda, UnreachableError } from "@arhnage/std";
import { Signal, Store } from "@arhnage/syren";

import { Renderable } from "../../runtime/jsx/renderable/index.ts";
import { Strategy } from "../../runtime/jsx/strategy/strategy.ts";
import { JSX } from "../../runtime/jsx/types/index.ts";

export interface ForProps<T> {
	each: T[] | Signal<T[]> | Store<T>;
	children: (value: T, index: number) => JSX.Child;
}

export function For<T>({ each, children }: ForProps<T>, _: JSX.Api): JSX.Children {
	if (Is.array(each)) {
		return each.map(children);
	}

	if (Is.signal(each)) {
		return Renderable.create((container) =>
			Signal.effect(
				//
				(each) => Strategy.mount(container, each.map(children)),
				[each as Signal<T[]>],
			),
		);
	}

	if (Is.store(each)) {
		return Renderable.create((container) => {
			const offset = container.childNodes.length;
			const cleanups: Array<Cleanup> = [];

			return Lambda.combine(
				Store.subscribe(
					each as Store<T>,
					(index, value) => {
						const slot = document.createElement("slot");

						Strategy.mount(slot, [children(value, index)]);

						const element = slot.childNodes[0];
						const current = container.childNodes[index + offset];
						if (Is.undefined(current)) {
							container.appendChild(element);
						} else {
							container.replaceChild(element, current);
						}

						cleanups[index] = () => container.removeChild(element);
					},
				),
				() => cleanups.forEach(Lambda.call),
			);
		});
	}

	throw new UnreachableError();
}
