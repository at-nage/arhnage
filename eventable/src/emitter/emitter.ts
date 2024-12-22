import { Struct } from "@arhnage/std";

const $subscribers = Symbol.for("subscribers");
type $subscribers = typeof $subscribers;

export type Emitter<T> = {
	[$subscribers]: {
		[K in keyof T]?: Array<(args: T[K]) => void>;
	};
};

function is<T>(value: object): value is Emitter<T> {
	return Object.hasOwn(value, $subscribers);
}

function create<T>(): Emitter<T> {
	return { [$subscribers]: {} };
}

function get<T extends Struct<string, unknown>, K extends keyof T & string>(source: Emitter<T>, event: K) {
	return (source[$subscribers][event] ??= []);
}

function fire<T extends Struct<string, unknown>, K extends keyof T & string>(source: Emitter<T>, event: K, args: T[K]) {
	const subscribers = get(source, event);
	subscribers.forEach((listener) => listener(args));
	return source;
}

function subscribe<T extends Struct<string, unknown>, K extends keyof T & string>(source: Emitter<T>, event: K, listener: (args: T[K]) => void) {
	const subscribers = get(source, event);
	subscribers.push(listener);
	return () => Emitter.unsubscribe(source, event, listener);
}

function unsubscribe<T extends Struct<string, unknown>, K extends keyof T & string>(source: Emitter<T>, event: K, listener: (args: T[K]) => void) {
	const subscribers = get(source, event);

	const index = subscribers.indexOf(listener);
	if (index === -1) {
		console.warn(`listener not found in emitter source while unsubscribing`);
		return;
	}

	subscribers.splice(index, 1);
}

export const Emitter = {
	is,
	create,
	fire,
	subscribe,
	unsubscribe,
};
