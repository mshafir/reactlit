import { Debug, useDebug } from "@/components/debug-toggle";
import { Text } from "@radix-ui/themes";
import { textPropDefs } from "@radix-ui/themes/props";
import {
	DataFetchingPlugin,
	useReactlit,
	useReactlitState,
} from "@reactlit/core";
import { DefaultRadixWrapper, Inputs, Label } from "@reactlit/radix";

export default function Starter() {
	const [appState, setAppState] = useReactlitState({
		name: "",
		weight: "regular",
		size: 1,
	});
	const Reactlit = useReactlit(DataFetchingPlugin);
	const debug = useDebug();
	return (
		<DefaultRadixWrapper>
			<Reactlit debug={debug} state={appState} setState={setAppState}>
				{async (ctx) => {
					const { display, view } = ctx;
					const name = view(
						"name",
						Debug,
						Label("What is your name?"),
						Inputs.Text({
							placeholder: "Enter name",
						}),
					);
					const weight = view(
						"weight",
						Debug,
						Label("Weight"),
						Inputs.Radio(["light", "regular", "medium", "bold"] as const),
					);
					const size = view(
						"size",
						Debug,
						Label("Size"),
						Inputs.Slider({
							min: 1,
							max: 9,
						}),
					);

					display(<hr />);
					display(
						Debug,
						<Text
							weight={weight}
							size={`${size}` as (typeof textPropDefs.size.values)[number]}
						>
							Hello to {name ? name : <Text color="red">Enter Name</Text>} from
							Reactlit!
						</Text>,
					);
				}}
			</Reactlit>
		</DefaultRadixWrapper>
	);
}
