import { JSX } from "../jsx/types/index.ts";

export interface RenderOptions {
  container: HTMLElement | string | null;
  component: JSX.Element;
}
