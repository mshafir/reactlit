import { Badge, Spinner } from "@radix-ui/themes";

export function TopRightLoader({ text }: { text: string }) {
	return (
		<Badge
			style={{
				position: "absolute",
				right: "0.5rem",
				top: "0.5rem",
				display: "flex",
				alignItems: "center",
				gap: "0.5rem",
			}}
		>
			<Spinner /> {text}
		</Badge>
	);
}
