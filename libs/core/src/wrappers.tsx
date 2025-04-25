import {
	Fragment,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	cloneElement,
	createElement,
	isValidElement,
} from "react";

export interface ReactlitWrapperProps {
	position: number;
	stateKey: string;
}

export type WrapperComponent = React.FC<
	PropsWithChildren<ReactlitWrapperProps>
>;

export type Wrapper = WrapperComponent | React.ReactElement;

export type SimpleWrapperComponent = React.FC<React.PropsWithChildren>;

export type SimpleWrapper = SimpleWrapperComponent | React.ReactElement;

export function applySimpleWrapper(
	children: ReactElement,
	Wrap?: SimpleWrapper,
): ReactNode {
	if (!Wrap) return children;
	if (isValidElement(Wrap)) return cloneElement(Wrap, {}, children);
	return Wrap({ children });
}

export function applyWrapper(
	children: ReactElement,
	Wrap?: Wrapper,
	props?: ReactlitWrapperProps,
): ReactElement {
	if (!Wrap) return children;
	if (isValidElement(Wrap)) return cloneElement(Wrap, {}, children);
	return Wrap({ children, ...props }) as ReactElement;
	// return createElement(Wrap, props, children);
}
export function ApplyWrappers({
	wrappers,
	children,
	...props
}: {
	wrappers: Wrapper[];
	children: ReactNode;
} & ReactlitWrapperProps) {
	const base = [...wrappers];
	const wrappedContent = base.reverse().reduce(
		(acc, W) => applyWrapper(acc, W, props),
		// this extra Fragment wrapper at the end is necessary for some
		// very mysterious reason to keep plain string nodes from shifting positions around
		// biome-ignore lint/complexity/noUselessFragments: <explanation>
		<Fragment>{children}</Fragment>,
	);
	return wrappedContent;
}

export const FragmentWrapper: Wrapper = ({ children, stateKey }) => {
	return <Fragment key={stateKey}>{children}</Fragment>;
};
