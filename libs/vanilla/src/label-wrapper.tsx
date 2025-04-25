import { WrapperComponent } from "@reactlit/core";

export type LabelWrapperProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export const Label = (label: string, props?: LabelWrapperProps) => {
	const LabelComponent: WrapperComponent = ({ children, stateKey }) => {
		return (
			<div {...props}>
				<label htmlFor={stateKey}>{label}</label>
				{children}
			</div>
		);
	};
	return LabelComponent;
};
