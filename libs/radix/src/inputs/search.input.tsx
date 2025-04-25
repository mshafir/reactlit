import { defineTransformView } from "@reactlit/core";
import Fuse, { IFuseOptions } from "fuse.js";
import { TextInputComponent, TextInputProps } from "./text.input";

export type SearchOptions<T> = Partial<IFuseOptions<T>>;

export type SearchInputProps<T> = Omit<TextInputProps, "children"> & {
	searchOptions?: SearchOptions<T>;
};

export function searchData<T>(
	data: T[] | undefined,
	search: string,
	options?: SearchOptions<T>,
) {
	if (!data) {
		return [];
	}
	if (!search) {
		return data;
	}
	const fuse = new Fuse(data, {
		isCaseSensitive: false,
		shouldSort: true,
		keys: Object.keys(data.at(0) ?? {}),
		...options,
	});

	return fuse.search(search).map((r) => r.item);
}

export function SearchInput<T>(
	data: T[] | undefined,
	{ searchOptions, ...props }: SearchInputProps<T>,
) {
	return defineTransformView<string, T[]>(
		(viewProps) => (
			<TextInputComponent
				{...viewProps}
				placeholder={"Search..."}
				type={"search" as const}
				{...props}
			>
				{/* {({ setValue }: ViewComponentProps<string>) => (
          <>
            <TextField.Slot>
              <SearchIcon height="16" width="16" />
            </TextField.Slot>
            <TextField.Slot>
              <IconButton size="1" variant="ghost">
                <X height="14" width="14" onClick={() => setValue('')} />
              </IconButton>
            </TextField.Slot>
          </>
        )} */}
			</TextInputComponent>
		),
		({ value }) => {
			return searchData(data ?? [], value, searchOptions);
		},
	);
}
