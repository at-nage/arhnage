import { Emitter } from "@arhnage/eventable";
import { For, JSX, Show } from "@arhnage/shaper";
import { Abort, Either, Is, Lambda, Stream, Task } from "@arhnage/std";
import { bind_to_store_middleware, Signal, signal, store, Store } from "@arhnage/syren";

import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TODO, UpdateTodo } from "./api.ts";

const todos_api: Api<TODO> = {
	list: GetTodos,
	item: GetTodo,
	create: CreateTodo,
	update: UpdateTodo,
	remove: DeleteTodo,
};

const todos = Store.middleware(
	store<TODO>([]),
	api_middleware(todos_api),
	//
);

interface Entity<T = unknown> {
	id: T;
}

interface Api<T extends Entity> {
	list: () => Task<Either<T[], Error>>;
	item: (id: T["id"]) => Task<Either<T, Error>>;
	create: (entity: Omit<T, "id">) => Task<Either<T, Error>>;
	update: (entity: T) => Task<Either<T, Error>>;
	remove: (id: T["id"]) => Task<Either<T["id"], Error>>;
}

function api_middleware<T extends Entity>(api: Api<T>) {
	return (store: Store<T>) => {
		Emitter.subscribe(store, "added", ({ index, value }) => {
			const result = api.create(value);
			console.log(result);
			Task.then(
				result,
				Either.match(
					Lambda.identity,
					// TODO: revert changes
					Lambda.identity,
				),
			);
		});

		Emitter.subscribe(store, "replaced", ({ value }) => {
			Task.then(
				api.update(value),
				Either.match(
					Lambda.identity,
					// TODO: revert changes
					Lambda.identity,
				),
			);
		});

		Emitter.subscribe(store, "removed", ({ value }) => {
			Task.then(
				api.remove(value.id),
				Either.match(
					Lambda.identity,
					// TODO: revert changes
					Lambda.identity,
				),
			);
		});

		Task.then(
			api.list(),
			Either.match(
				(list) => Store.set(store, list),
				Lambda.error<unknown>,
				//
			),
		);
	};
}

const NewToDoButton: JSX.FC = () => {
	const edit = signal(false);

	const abort = Abort.create();
	const title = signal("");
	const description = signal("");

	return (
		<div class="flex my-4">
			<Show when={edit}>
				<button on:click={() => Signal.set(edit, true)}>+ add todo</button>
			</Show>
			<Show not when={edit}>
				<div class="grow p-3 border-2 rounded-lg">
					<input
						class="w-full outline-none"
						placeholder="title"
						bind:value={title}
						on:input={Stream.pipe(
							Stream.debounce(1000, { abort }),
							Stream.tap((e) => Signal.set(title, e.target.value)),
						)}
					/>
					<textarea
						class="w-full outline-none"
						placeholder="description"
						bind:value={description}
						on:input={Stream.pipe(
							Stream.debounce(1000, { abort }),
							Stream.tap((e) => Signal.set(title, e.target.value)),
						)}
					/>
					<div class="flex justify-end gap-2">
						<button
							class="border py-1 px-3"
							on:click={() => {
								Signal.set(edit, false);
								Abort.cancel(abort);
								Signal.reset(title);
								Signal.reset(description);
							}}
						>
							cancel
						</button>
						<button
							class="border py-1 px-3"
							on:click={Stream.pipe(
								Stream.map(() => {
									Abort.cancel(abort);
									return {
										id: -1,
										done: false,
										title: Signal.get(title),
										description: Signal.get(description),
									};
								}),
								Stream.filter((todo) => Is.empty(todo.title)),
								Stream.tap((todo) => {
									Signal.set(edit, false);
									Store.insert(todos, todo);
									Signal.reset(title);
									Signal.reset(description);
								}),
							)}
						>
							add todo
						</button>
					</div>
				</div>
			</Show>
		</div>
	);
};

export const ToDo: JSX.FC = () => {
	return (
		<>
			<div class="flex flex-col gap-4">
				<For each={todos}>
					{(todo, i) => {
						const done = Signal.middleware(
							signal(false),
							bind_to_store_middleware(todos, [i, "done" as const]),
							//
						);

						return (
							<div class="flex gap-2">
								<div>
									<input
										//
										type="checkbox"
										bind:data-done={done}
										bind:checked={done}
										on:input={(e) => Signal.set(done, e.target.checked)}
									/>
								</div>
								<div>
									<div>
										<b>{todo.title}</b>
									</div>
									{todo?.description && <div>{todo.description}</div>}
								</div>
								<button on:click={() => Store.remove(todos, todo)}>-</button>
							</div>
						);
					}}
				</For>
			</div>
			<NewToDoButton />
		</>
	);
};
