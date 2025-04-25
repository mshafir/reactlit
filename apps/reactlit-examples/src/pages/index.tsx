import { ArrowBigLeftDash } from "lucide-react";

export default function Home() {
	return (
		<div className="justify-center items-center">
			<h1 className="text-4xl font-bold pb-4">Welcome to ReactLit.</h1>
			<div className="flex items-center">
				<ArrowBigLeftDash /> Explore the examples to get started.
			</div>
		</div>
	);
}
