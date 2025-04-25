import { Reactlit } from "@reactlit/core";
import { defineTransformView } from "@reactlit/core";

export const FilterInput = (values: string[]) =>
	defineTransformView<string, string[]>(
		({ value, setValue, stateKey }) => (
			<input
				id={stateKey}
				value={value ?? ""}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search"
			/>
		),
		(props) =>
			values.filter(
				(value) =>
					!props.value ||
					value.toLowerCase().includes(props.value.toLowerCase()),
			),
	);

export default function HelloWorld() {
	return (
		<Reactlit>
			{async ({ display, view }) => {
				const users = ["Michael", "Mary", "John", "Jane", "Jim", "Jill"];
				display("Search for a user: ");
				const filteredUsers = view("filteredUsers", FilterInput(users));
				if (filteredUsers.length === 0) {
					throw new Error("No matching users found");
				}
				display(<div>You are filtering to {filteredUsers.join(", ")}</div>);
			}}
		</Reactlit>
	);
}
