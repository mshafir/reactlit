import {
	ViewComponentProps,
	ViewDefinition,
	defineTransformView,
	defineView,
} from "@reactlit/core";
import { DetailedHTMLProps } from "react";

export type CheckInputProps<T> = Omit<
	DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>,
	"value" | "disabled" | "className"
> & {
	data: T[];
	className?: {
		wrapper?: string;
		item?: {
			wrapper?: string;
			input?: string;
			label?: string;
		};
	};
	format?: (value: T) => string | React.ReactNode;
	valueof?: (value: T) => string;
	disabled?: string[] | ((value: T) => boolean);
};

export const CheckInputComponent = <T,>({
	value,
	stateKey,
	display,
	view,
	setValue,
	onChange,
	data,
	className,
	format,
	valueof,
	disabled,
	...props
}: CheckInputProps<T> & ViewComponentProps<(string | T)[]>) => {
	return (
		<div className={className?.wrapper}>
			{data.map((item) => {
				const isChecked = !!value.find((v) =>
					valueof ? valueof(item) === v : item === v,
				);
				const itemKey = `${stateKey}-${valueof?.(item) ?? item.toString()}`;
				let disabledValue = false;

				if (typeof disabled === "function") {
					disabledValue = disabled(item);
				} else if (Array.isArray(disabled)) {
					disabledValue = disabled.includes(valueof?.(item) ?? item.toString());
				}

				return (
					<div key={itemKey} className={className?.item?.wrapper}>
						<input
							type="checkbox"
							checked={isChecked}
							id={itemKey}
							name={itemKey}
							className={className?.item?.input}
							onChange={(e) => {
								const _value = valueof?.(item) ?? item;
								if (e.target.checked) setValue([...value, _value]);
								else setValue(value.filter((v) => v !== _value));
							}}
							disabled={disabledValue}
							{...props}
						/>
						<label htmlFor={itemKey} className={className?.item?.label}>
							{format?.(item) ?? item.toString()}
						</label>
					</div>
				);
			})}
		</div>
	);
};

export type CheckInputDefinition<T, P> = P extends { valueof: (v: T) => string }
	? ViewDefinition<string[], T[]>
	: ViewDefinition<T[]>;

export const CheckInput = <T, P extends CheckInputProps<T>>(
	data: P["data"],
	{ valueof, ...props }: Omit<P, "data">,
): CheckInputDefinition<T, P> => {
	if (valueof) {
		return defineTransformView<string[], T[]>(
			(viewProps) => (
				<CheckInputComponent
					data={data}
					{...viewProps}
					{...props}
					valueof={valueof}
				/>
			),
			({ value }) => {
				return value.map((v) => data.find((d) => valueof(d) === v));
			},
		) as CheckInputDefinition<T, P>;
	}
	return defineView<T[]>((viewProps) => (
		<CheckInputComponent data={data} {...viewProps} {...props} />
	)) as CheckInputDefinition<T, P>;
};
