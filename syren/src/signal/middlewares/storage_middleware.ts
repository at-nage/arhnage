// deno-lint-ignore-file no-explicit-any

import { Lambda } from "@arhnage/std";

import { Signal } from "../signal.ts";

interface LocalStorageMiddlewareOptions<T = any> {
	get: (value: T) => T;
	set: (lambda: (value: unknown) => void) => (value: unknown) => void;
}

const default_options: LocalStorageMiddlewareOptions = {
	get: Lambda.identity,
	set: Lambda.identity,
};

const storage_middleware = <T>(storage: Storage) => (key: string, options?: Partial<LocalStorageMiddlewareOptions<T>>) => {
	const { get, set } = Object.assign({}, default_options, options);

	return (signal: Signal<T>) => {
		const value = storage.getItem(key);
		if (value != null) {
			Signal.set(signal, get(JSON.parse(value)));
		}

		Signal.subscribe(
			signal,
			set((value) => storage.setItem(key, JSON.stringify(value))),
		);
	};
}

export const local_storage_middleware = storage_middleware(localStorage);
export const session_storage_middleware = storage_middleware(sessionStorage);

