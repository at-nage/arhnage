import { Is } from "@arhnage/std";

export const class_property_strategy = {
	is: (_: HTMLElement, key: unknown, value: unknown) => Is.string(key) && key === "class" && Is.string(value),
	create: (element: HTMLElement, _: unknown, value: string) => {
		for (const class_name of value.split(" ")) {
			if (!Is.empty(class_name)) {
				element.classList.add(class_name);
			}
		}
	},
};
