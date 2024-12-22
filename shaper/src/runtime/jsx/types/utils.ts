import { Lambda } from "@arhnage/std";

type NonFunctionKeys<T> = Exclude<{
  [K in keyof T]: NonNullable<T[K]> extends Lambda ? never : K;
}[keyof T], undefined>;

type NonFunction<T> = {
  [K in NonFunctionKeys<T>]: T[K];
};

type IfEquals<T, U, Y = true, N = false> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? Y : N;

type NonReadonlyKeys<T> = Exclude<{
  [K in keyof T]: IfEquals<{
      [Q in K]: T[K];
  }, {
      -readonly [Q in K]: T[K];
  }, K>;
}[keyof T], boolean | undefined>;

export type PickMutable<T> = Pick<T, NonReadonlyKeys<T> & NonFunctionKeys<T>>;
