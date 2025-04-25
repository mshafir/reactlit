import { ViewComponentProps, defineView } from "@reactlit/core";
import { DetailedHTMLProps } from "react";
import { useDebouncedCallback } from "use-debounce";

export type TextInputProps = Omit<
	DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>,
	"value"
> & {
	debounceDelay?: number;
};

export const TextInputComponent = ({
	value,
	stateKey,
	display,
	view,
	setValue,
	onChange,
	debounceDelay = 200,
	...props
}: TextInputProps & ViewComponentProps<string>) => {
	const debouncedSetValue = useDebouncedCallback((value) => {
		setValue(value);
	}, debounceDelay);
	return (
		<input
			type="text"
			defaultValue={value}
			onChange={(e) => {
				debouncedSetValue(e.target.value);
				onChange?.(e);
			}}
			{...props}
		/>
	);
};

export const TextInput = (props: TextInputProps) =>
	defineView<string>((viewProps) => (
		<TextInputComponent {...viewProps} {...props} />
	));
