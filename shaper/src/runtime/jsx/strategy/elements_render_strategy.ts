import { Is } from "@arhnage/std";

import { Html } from "../../html/index.ts";

import { JSX } from "../types/index.ts";
import { Strategy } from "./strategy.ts";

export const elements_render_strategy = {
  is: (elements: JSX.Elements) => Is.array(elements),
  create: (container: Html.Element, elements: Array<JSX.Child>) => {
    return Strategy.mount(container, elements);
  },
};
