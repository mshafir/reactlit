import { Container, Flex, Theme, ThemeProps } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

export const BoxContainerWrapper: React.FC<PropsWithChildren> = ({
	children,
}) => (
	<Container size="2" align={"left"}>
		<Flex direction="column" gap="3">
			{children}
		</Flex>
	</Container>
);

export const RadixTheme = ({
	children,
	...props
}: PropsWithChildren<ThemeProps>) => {
	return (
		<Theme data-is-root-theme={false} {...props}>
			{children}
		</Theme>
	);
};

export const RadixThemeWrapper = (theme?: ThemeProps) => {
	const RadixThemeWrapper: React.FC<PropsWithChildren> = ({ children }) => (
		<RadixTheme {...theme}>{children}</RadixTheme>
	);
	return RadixThemeWrapper;
};

export const RadixWrapper = (theme?: ThemeProps) => {
	const ThemeWrapper = RadixThemeWrapper(theme);
	const RadixWrapper: React.FC<PropsWithChildren> = ({ children }) => (
		<ThemeWrapper>
			<BoxContainerWrapper>{children}</BoxContainerWrapper>
		</ThemeWrapper>
	);
	return RadixWrapper;
};

export const DefaultRadixWrapper = RadixWrapper();
