import { UnreachableError } from "../errors/index.ts";
import { Lambda } from "../lambda/index.ts";
import { Struct } from "../struct/index.ts";
import { Type } from "../type/index.ts";

export const $either = Symbol.for("either");
export type $either = typeof $either;

const $left = Symbol.for("left");
type $left = typeof $left;

const $right = Symbol.for("right");
type $right = typeof $right;

export type Either<T, E> = {
  [$left]?: T;
  [$right]?: E
};

const left = <T, E>(left: T): Either<T, E> => {
	return <Either<T, E>>Struct.assign(
		//
		Type.create($either),
		{ [$left]: left },
	);
};

const right = <T, E>(right: E): Either<T, E> => {
	return <Either<T, E>>Struct.assign(
		//
		Type.create($either),
		{ [$right]: right },
	);
};

interface Match {
  <T, E, R>(on_left: (value: T) => R, on_right: (value: E) => R): (either: Either<T, E>) => R;
  <T, E, R>(either: Either<T, E>, on_left: (value: T) => R, on_right: (value: E) => R): R;
}

const match: Match = Lambda.fflip(<T, E>(either: Either<T, E>, on_left: (value: T) => void, on_right: (value: E) => void) => {
  switch (true) {
    case Struct.has(either, $left):
      return on_left(either[$left]!);
    case Struct.has(either, $right):
      return on_right(either[$right]!);
    default:
      throw new UnreachableError();
  }
})

export const Either = {
	left,
	right,
  match,
};
