import { Is } from "../is/index.ts";
import { Lambda } from "../lambda/index.ts";

export const iota = Lambda.bind({ value: 0 }, function (number?: number) {
  return Is.undefined(number) ? this.value++ : (this.value = number);
});
