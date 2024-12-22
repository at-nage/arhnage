import { JSX } from "@arhnage/shaper";

import { Header, Main, Aside, Nav, Tools, Heading, Content } from "../layout/index.ts";
import { ToDo } from "../components/todo/todo.tsx";

export const Root: JSX.FC = () => {
	return (
		<>
			<Aside>
				<Header />
				<Nav />
			</Aside>
			<Main>
				<Tools>
					tools
				</Tools>
				<Heading>
					Today
				</Heading>
				<Content>
					<ToDo />					
				</Content>
			</Main>
		</>
	);
};
