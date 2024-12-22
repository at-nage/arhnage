import { Either } from "@arhnage/std";
import { pipe } from "@arhnage/std";
import { Task } from "@arhnage/std";

function id() {
	return Math.floor(Math.random() * 1_000_000);
}

function wait() {
	return 100 * Math.floor(Math.random() * 4);
}

function failure() {
	return Math.floor(Math.random() * 100);
}

const storage = (storage: Storage) => {
	return {
		get<T = string>(key: string) {
			const value = storage.getItem(key);
			if (!value) return;
			return JSON.parse(value) as T;
		},
		set<T>(key: string, value: T) {
			storage.setItem(key, JSON.stringify(value));
		},
	};
};

export const local_storage = storage(localStorage);

export interface TODO {
	id: number;
	done: boolean;
	title: string;
	description: string;
}

export function GetTodos(): Task<Either<TODO[], Error>> {
	const todos = local_storage.get<TODO[]>("todos") ?? [];

	if (failure() < 25) {
		return Either.right(new Error("InternalServerError"));
	}

	return pipe(
		Task.delay(wait()),
		Task.then(() => Either.left(todos)),
	);
}

export function GetTodo(id: number): Task<Either<TODO, Error>> {
	return Task.then(
		GetTodos(),
		Either.match((todos) => {
			const todo = todos?.find((todo) => todo.id === id);
			if (!todo) {
				return Either.right(new Error("Todo.NotFound"));
			}

			return Either.left(todo);
		}, Either.right<TODO, Error>),
	);
}

export function CreateTodo(todo: Omit<TODO, "id">): Task<Either<TODO, Error>> {
	return pipe(
		Task.delay(wait()),
		GetTodos,
		Task.then(
			Either.match((todos) => {
				const entity = Object.assign(todo, { id: id() });
				todos.push(entity);
				local_storage.set("todos", todos);
				return Either.left(entity);
			}, Either.right<TODO, Error>),
		),
	);
}

export function UpdateTodo(todo: TODO): Task<Either<TODO, Error>> {
	return pipe(
		Task.delay(wait()),
		GetTodos,
		Task.then(
			Either.match((todos) => {
				const index = todos?.findIndex((entity) => entity.id === todo.id);
				if (index === -1) {
					return Either.right(new Error("Todo.NotFound"));
				}

				todos[index] = todo;
				local_storage.set("todos", todos);

				return Either.left(todo);
			}, Either.right<TODO, Error>),
		),
	);
}

export function DeleteTodo(id: number): Task<Either<number, Error>> {
	return pipe(
		Task.delay(wait()),
		GetTodos,
		Task.then(
			Either.match((todos) => {
				const index = todos?.findIndex((entity) => entity.id === id);
				if (index === -1) {
					return Either.right(new Error("Todo.NotFound"));
				}

				todos.splice(index, 1);
				local_storage.set("todos", todos);

				return Either.left(id);
			}, Either.right<number, Error>),
		),
	);
}
