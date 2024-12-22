import { Lambda } from "../lambda/lambda.ts";
import { Struct } from "../struct/index.ts";
import { Type } from "../type/index.ts";

export const $abort = Symbol.for("abort");
export type $abort = typeof $abort;

export const $canceled = Symbol.for("canceled");
export type $canceled = typeof $canceled;

export const $subscriber = Symbol.for("subscriber");
export type $subscriber = typeof $subscriber;

type Listener = Lambda<[], void>;

export type Abort = {
	[$canceled]: boolean;
	[$subscriber]: Lambda;
};

function create(): Abort {
	return Struct.assign(Type.create($abort), { [$canceled]: false, [$subscriber]: Lambda.identity });
}

function canceled(abort: Abort) {
	return abort[$canceled];
}

function reset(abort: Abort) {
	abort[$canceled] = false;
	return abort;
}

function abort(abort: Abort) {
	abort[$canceled] = true;
	abort[$subscriber]();
	return abort;
}

const subscribe = Lambda.fflip((abort: Abort, listener: Listener) => {
	abort[$subscriber] = listener;
	return abort;
});

export const Abort = {
	create,
	reset,
	canceled,
	abort,
	subscribe,
};
