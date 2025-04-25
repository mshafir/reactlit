import { Text, TextProps } from "@radix-ui/themes";
import { WrapperComponent } from "@reactlit/core";

export type LabelType = string | React.ReactNode;

export type LabelProps = TextProps;

export const Label = (label: string, props?: LabelProps): WrapperComponent => {
	const LabelComponent: WrapperComponent = ({ children }) => {
		return (
			<Text as="label" {...props}>
				{label}
				{children}
			</Text>
		);
	};
	return LabelComponent;
};
