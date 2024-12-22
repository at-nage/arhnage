import { For, JSX, Show } from "@arhnage/shaper";

import { Footer, Header, Main } from "../layout/index.ts";
import { Signal, signal, store, Store } from "@arhnage/syren";
import { Lambda } from "../../../std/src/index.ts";

const Counter: JSX.FC = (_, { use, memo }) => {
	const numbers = memo(() => store([1, 2, 3]));

	use(() => {
		console.log("mount Counter");
		return () => console.log("unmount Counter");
	});

	return (
		<>
			<For each={numbers}>
				{(number) => <span>{number}</span>}
			</For>
			<div>
				<button on:click={() => Store.map(numbers, Lambda.multiply(2))}>multiply</button>
				<button on:click={() => Store.map(numbers, Lambda.divide(2))}>divide</button>
			</div>
		</>
	);
};

export const Root: JSX.FC = () => {
	const show = signal(false);

	return (
		<>
			<Header />
			<Main>
				<button bind:data-show={show} on:click={() => Signal.over(show, Lambda.toggle)}>
					toggle
				</button>
				<Show when={show}>
					<p>
						<Counter />
					</p>
				</Show>
			</Main>
			<Footer />
		</>
	);
};
