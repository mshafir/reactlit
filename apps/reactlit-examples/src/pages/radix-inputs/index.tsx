import { Debug, useDebug } from "@/components/debug-toggle";
import {
	Badge,
	ChevronDownIcon,
	DataList,
	ThickChevronRightIcon,
} from "@radix-ui/themes";
import {
	LayoutView,
	Reactlit,
	Wrapper,
	WrapperComponent,
	defaultLayoutState,
	useReactlitState,
} from "@reactlit/core";
import { DefaultRadixWrapper, Inputs, Label } from "@reactlit/radix";
import { useState } from "react";

interface Country {
	name: string;
	region: string;
	subregion: string;
	population: number;
	code: string;
}

export async function fetchCountries(): Promise<Country[]> {
	const results = await fetch(
		"https://restcountries.com/v3.1/all?fields=name,region,subregion,population,cca2",
		{
			cache: "force-cache",
			next: {
				revalidate: 300,
				tags: ["countries"],
			},
		},
	);
	const rawResults = await results.json();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return rawResults.map((r: any) => ({
		name: r.name.common,
		region: r.region,
		subregion: r.subregion,
		population: r.population,
		code: r.cca2,
	}));
}

const DisplayLabel = (label: string) => {
	const DisplayLabelComponent: WrapperComponent = ({ children }) => (
		<DataList.Item>
			<DataList.Label>{label}</DataList.Label>
			<DataList.Value>{children}</DataList.Value>
		</DataList.Item>
	);
	return DisplayLabelComponent;
};

const ResultsWrapper: Wrapper = ({ children }) => {
	const [open, setOpen] = useState(true);
	return (
		<div
			className={`flex flex-col overlay ${open ? "open" : ""}`}
			onClick={() => setOpen(!open)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					setOpen(!open);
				}
			}}
		>
			<h3 className="overlay-header">
				{open ? <ChevronDownIcon /> : <ThickChevronRightIcon />}
				Results
			</h3>
			<div className="overflow-y-auto flex-auto">
				<DataList.Root orientation={"vertical"}>{children}</DataList.Root>
			</div>
		</div>
	);
};

export default function RadixInputs() {
	const [appState, setAppState] = useReactlitState({
		countrySearch: "",
		country: undefined as Country | undefined,
		results: defaultLayoutState(1),
		name: "",
		bio: "",
		number: [],
		letter: undefined as string | undefined,
		color: "red",
		slider: 0,
		rangeSlider: [20, 80],
		enableLetter: true,
	});
	const debug = useDebug();
	return (
		<DefaultRadixWrapper>
			<Reactlit debug={debug} state={appState} setState={setAppState}>
				{async ({ display, view }) => {
					display(<div className="text-2xl">Inputs test</div>);
					const [results] = view("results", ResultsWrapper, LayoutView(1));
					const displayResult = (label: string, value: React.ReactNode) => {
						results.display(Debug, DisplayLabel(label), value);
					};
					const name = view(
						"name",
						Label("Name"),
						Inputs.Text({
							placeholder: "Enter your name",
						}),
					);
					displayResult("Name", name);
					const bio = view(
						"bio",
						Label("Bio"),
						Inputs.TextArea({
							placeholder: "Enter your bio",
						}),
					);
					displayResult("Bio", bio);
					const number = view(
						"number",
						Label("Pick any numbers"),
						Inputs.Check({ one: "1", two: "2", three: "3" }),
					);
					displayResult("Numbers", number);
					if (
						view(
							"enableLetter",
							Label("Letter Selection"),
							<div />,
							Inputs.Switch(),
						)
					) {
						const letter = view(
							"letter",
							Label("Pick one Letter"),
							Inputs.Radio(["A", "B", "C"]),
						);
						displayResult("Letter", letter);
					}
					const color = view(
						"color",
						Label("Pick a color"),
						<div />,
						Inputs.Select(["red", "blue", "green"] as const),
					);
					displayResult("Color", <Badge color={color}>{color}</Badge>);
					const slider = view(
						"slider",
						Label("Slider"),
						Inputs.Slider({
							min: 0,
							max: 100,
						}),
					);
					displayResult("Slider", slider);
					const rangeSlider = view(
						"rangeSlider",
						Label("Range Slider"),
						Inputs.RangeSlider({
							min: 0,
							max: 100,
						}),
					);
					displayResult("Range Slider", rangeSlider.join(" - "));
					const countries = await fetchCountries();
					display(<div className="font-semibold">Select a country</div>);
					const filteredCountries = view(
						"countrySearch",
						Label("Search"),
						Inputs.Search(countries, {
							placeholder: "Search countries...",
						}),
					);
					const selectedCountry = view(
						"country",
						Label("Countries"),
						Inputs.Table(filteredCountries, {
							getRowId: (country) => country.code,
							className: "h-[300px]",
						}),
					);
					displayResult(
						"Country",
						selectedCountry?.code ? (
							<img
								src={`https://flagsapi.com/${selectedCountry.code}/flat/64.png`}
								alt={selectedCountry.name}
							/>
						) : (
							"Select a country"
						),
					);
				}}
			</Reactlit>
		</DefaultRadixWrapper>
	);
}
