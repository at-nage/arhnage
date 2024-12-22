function delay(wait: number = 0) {
	const { promise, resolve } = Promise.withResolvers<void>();
	setTimeout(resolve, wait);
	return promise;
}

export type Task = typeof Task;

export const Task = {
  delay,
}
