import { Cleanup, Is, Lambda, UnreachableError } from "@arhnage/std";
import { Signal, Store } from "@arhnage/syren";

import { Renderable } from "../../runtime/jsx/renderable/index.ts";
import { Strategy } from "../../runtime/jsx/strategy/strategy.ts";
import { JSX } from "../../runtime/jsx/types/index.ts";
import { Emitter } from "@arhnage/eventable";

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
				[each],
			),
		);
	}

	if (Is.store(each)) {
		return Renderable.create((container) => {
			const offset = container.childNodes.length;
			
			let cleanup: Cleanup | undefined;
			const cleanups: Array<Cleanup | undefined> = [];

			return Lambda.combine(
				Store.subscribe(each, (value) => {
					cleanup?.();
					cleanup = Strategy.mount(container, value.map(children));
				}),
				Emitter.subscribe(each, "added", ({ index, value }) => {
					const slot = document.createElement("slot");
					Strategy.mount(slot, [children(value, index)]);
					const element = slot.childNodes[0];

					container.appendChild(element);

					cleanups[index] = () => container.removeChild(element);
				}),
				Emitter.subscribe(each, "removed", ({ index }) => {
					container.removeChild(container.childNodes[index + offset]);
					cleanups[index] = undefined;
				}),
				() => {
					cleanup?.();
					for (const lambda of cleanups) {
						lambda?.();
					}
				},
			);
		});
	}

	throw new UnreachableError();
}
