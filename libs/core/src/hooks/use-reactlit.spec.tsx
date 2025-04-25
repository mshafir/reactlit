import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { definePlugin, useReactlit } from "./use-reactlit";
import { useReactlitState } from "./use-reactlit-state";

test("reactlit plugin", async () => {
	let pluginRan = false;
	const TestPlugin = definePlugin(({ display }) => ({
		runPlugin: () => {
			pluginRan = true;
			return display("Hello from plugin");
		},
	}));

	function PluginTest() {
		const [state, setState] = useReactlitState({
			firstName: "John",
			lastName: "Doe",
		});
		const Reactlit = useReactlit(TestPlugin);
		return (
			<Reactlit state={state} setState={setState}>
				{async (ctx) => {
					ctx.runPlugin();
				}}
			</Reactlit>
		);
	}
	render(<PluginTest />);
	expect(pluginRan).toBe(true);
	expect(await screen.findByText("Hello from plugin")).toBeVisible();
});
