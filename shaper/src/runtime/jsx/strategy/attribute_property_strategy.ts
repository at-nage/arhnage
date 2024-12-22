import { Is } from "@arhnage/std";

export const attribute_property_strategy = {
	is: (_: HTMLElement, key: unknown, value: unknown) => Is.string(key) && Is.string(value),
	create: (element: HTMLElement, key: string, value: string) => {
		element.setAttribute(key, value);
	},
};
