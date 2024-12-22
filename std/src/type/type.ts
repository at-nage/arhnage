import { Lambda, Struct } from "../index.ts";

const $type = Symbol.for("type");
type $type = typeof $type;

export type Type<T> = {
	[$type]: T;
};

function create<T extends symbol>(type: T): Type<T> {
	return { [$type]: type };
}

const has = Lambda.fflip(<T extends symbol>(struct: object, type: T) => {
	return Struct.has(struct, $type, type);
}) as {
	<T extends symbol>(struct: object, type: T): struct is Struct<$type, T>;
	<T extends symbol>(type?: T): (struct: object) => struct is Struct<$type, T>;
};

export const Type = {
	create,
	has,
};
