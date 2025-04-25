import { Switch, SwitchProps } from "@radix-ui/themes";
import { ViewComponentProps, defineView } from "@reactlit/core";
import { LabelType } from "../label";

export type SwitchInputProps = Omit<
	SwitchProps,
	"checked" | "onCheckedChange" | "value" | "onValueChange"
>;

export const SwitchInputComponent = ({
	value,
	stateKey,
	setValue,
	display,
	view,
	...props
}: SwitchInputProps & ViewComponentProps<boolean>) => {
	return <Switch checked={value} onCheckedChange={setValue} {...props} />;
};

export const SwitchInput = (props?: SwitchInputProps) =>
	defineView<boolean>((viewProps) => (
		<SwitchInputComponent {...viewProps} {...props} />
	));
