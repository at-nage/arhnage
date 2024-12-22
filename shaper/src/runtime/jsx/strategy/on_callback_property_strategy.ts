import { Is, Lambda } from "@arhnage/std";

export const on_callback_property_strategy = {
	is: (_: HTMLElement, key: unknown, value: unknown) => Is.string(key) && key.startsWith("on:") && Is.lambda(value),
	create: (element: HTMLElement, key: string, value: Lambda) => {
		key = key.substring(3);
		element.addEventListener(key, value);		
	},
};
