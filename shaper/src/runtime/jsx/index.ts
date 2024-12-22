// deno-lint-ignore-file

import { h as jsx_h, f as jsx_f } from './jsx.ts';
import { JSX } from './types/index.ts';

type IntrinsicElementsMap = JSX.IntrinsicElements;
type IntrinsicAttributesMap = JSX.IntrinsicAttributes;

// declare module globalThis {
//   declare const h: typeof h;
//   declare const f: typeof f;
// }

declare global {
  interface Window {
    h: typeof jsx_h;
    f: typeof jsx_f;
  }

  const h: typeof jsx_h;
  const f: typeof jsx_f;

  namespace JSX {
    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicElements extends IntrinsicElementsMap {}
    interface IntrinsicAttributes extends IntrinsicAttributesMap {}
  }
}

window.h = jsx_h;
window.f = jsx_f;
