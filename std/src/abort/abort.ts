import { Lambda } from "../lambda/lambda.ts";
import { Struct } from "../struct/index.ts";
import { Type } from "../type/index.ts";

export const $abort = Symbol.for("abort");
export type $abort = typeof $abort;

const $canceled = Symbol.for("canceled");
type $canceled = typeof $canceled;

const $subscriber = Symbol.for("subscriber");
type $subscriber = typeof $subscriber;

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

function cancel(abort: Abort) {
	if(!abort[$canceled]) {
		abort[$subscriber]();
	}

	abort[$canceled] = true;
	
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
	cancel,
	subscribe,
};
