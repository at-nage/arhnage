import { Is } from "@arhnage/std";

export const key_property_strategy = {
	is: (element: HTMLElement, key: unknown, _: unknown) => Is.string(key) && key in element,
	create: (element: HTMLElement, key: string, value: unknown) => {
		// @ts-expect-error somehow string can not be a key
		element[key] = value;
	},
};
