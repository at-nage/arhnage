import { Html } from "../../html/index.ts";

export const unhandled_strategy = {
  is: () => true,
  create: (_: Html.Element, key: unknown, value: unknown) => {
    console.warn(`Unhandled attribute. key: ${key}; value: ${value};`);
  },
};
