import { defineLayout } from "@reactlit/core";

export const ThreeColumnLayout = defineLayout(
	3,
	({ slots: [Slot1, Slot2, Slot3] }) => (
		<div
			style={{
				display: "grid",
				gap: "1rem",
				gridTemplateColumns: "1fr 1fr 1fr",
				alignItems: "baseline",
			}}
		>
			<div>
				<Slot1 />
			</div>
			<div>
				<Slot2 />
			</div>
			<div>
				<Slot3 />
			</div>
		</div>
	),
);
