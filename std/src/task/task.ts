import { Lambda } from "../index.ts";

export type Task<T = void> = T | PromiseLike<T>;

function delay(wait: number = 0): Task<void> {
	const { promise, resolve } = Promise.withResolvers<void>();
	setTimeout(resolve, wait);
	return promise;
}

interface Then {
	<A, B>(task: Task<A>, on_then: Lambda<[A], Task<B>>): Task<B>;
	<A, B>(on_then: Lambda<[A], Task<B>>): (task: Task<A>) => Task<B>;
}

const then: Then = Lambda.fflip(async <A, B>(task: Task<A>, on_then: Lambda<[A], Task<B>>) => {
	const value = await task;
	return on_then(value);
})

export const Task = {
	then,
  delay,
}
