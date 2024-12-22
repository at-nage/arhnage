import { Lambda, Struct } from "@arhnage/std";

import { JSX } from "../types/index.ts";

import { attribute_property_strategy } from "./attribute_property_strategy.ts";
import { bind_property_strategy } from "./bind_property_strategy.ts";
import { class_property_strategy } from "./class_property_strategy.ts";
import { elements_render_strategy } from "./elements_render_strategy.ts";
import { key_property_strategy } from "./key_property_strategy.ts";
import { number_render_strategy } from "./number_render_strategy.ts";
import { on_callback_property_strategy } from "./on_callback_property_strategy.ts";
import { ref_property_strategy } from "./ref_property_strategy.ts";
import { renderable_strategy } from "./renderable_strategy.ts";
import { signal_render_strategy } from "./signal_render_strategy.ts";
import { string_render_strategy } from "./string_render_strategy.ts";
import { unhandled_strategy } from "./unhandled_property_strategy.ts";

import { PropertyStrategy, RenderStrategy } from "./types.ts";

const mount_strategies = <Array<RenderStrategy>>[
	number_render_strategy,
	string_render_strategy,
	signal_render_strategy,
	renderable_strategy,
	elements_render_strategy,
];

const property_strategies = <Array<PropertyStrategy>>[
	class_property_strategy,
	key_property_strategy,
	attribute_property_strategy,
	ref_property_strategy,
	on_callback_property_strategy,
	bind_property_strategy,
	unhandled_strategy,
];

function mount(container: HTMLElement, children: Array<JSX.Children>) {
	const cleanups: Array<Lambda<[], void>> = [];

	for (const child of children) {
		for (const strategy of mount_strategies) {
			if (strategy.is(child)) {
				const cleanup = strategy.create(container, child);
				if (cleanup) cleanups.push(cleanup);
				break;
			}
		}
	}

	return () => {
		cleanups.forEach(Lambda.call);
		cleanups.length = 0;
	};
}

function property(container: HTMLElement, properties: Struct<string, unknown>) {
	const cleanups: Array<Lambda<[], void>> = [];

	for (const [key, value] of Object.entries(properties)) {
		for (const strategy of property_strategies) {
			if (strategy.is(container, key, value)) {
				const cleanup = strategy.create(container, key, value);
				if (cleanup) cleanups.push(cleanup);
				break;
			}
		}
	}

	return () => {
		cleanups.forEach(Lambda.call);
		cleanups.length = 0;
	};
}

export type Strategy = typeof Strategy;

export const Strategy = {
	mount,
	property,
};
