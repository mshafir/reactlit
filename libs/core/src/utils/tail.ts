// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function tail<T extends any[], U>(args: [...T, U]): [T, U] {
	return [args.slice(0, -1) as T, args.at(-1) as U];
}
