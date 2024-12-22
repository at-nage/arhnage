export type key = string | number | symbol;
export type keys = Array<string | number | symbol>;

export type Assigned<A, B> = Omit<A, keyof B> & B;

export type Expand<T> = T extends object
  ? T extends (...args: infer A) => infer R
    ? (...args: Expand<A>) => Expand<R>
    : T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;
  