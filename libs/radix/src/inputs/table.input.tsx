import { Checkbox, Radio, ScrollArea, Skeleton, Table } from '@radix-ui/themes';
import {
  applyWrapper,
  defineTransformView,
  ViewComponentProps,
  ViewDefinition,
} from '@reactlit/core';
import { ReactNode, useMemo } from 'react';
import { BaseProps } from '../config';
import { userFriendlyName } from '../utils/user-friendly-name';
import { repeatElement } from '../utils/repeat-element';

export type TableInputProps<T> = Table.RootProps &
  BaseProps & {
    data: T[];
    getRowId: (row: T) => string;
    columns?: (keyof T & string)[];
    header?: ColumnHeaderMapping<T>;
    format?: ColumnDisplayMapping<T>;
    maxHeight?: string;
    multiple?: boolean;
    loading?: boolean;
  };

type ColumnHeaderMapping<T> = {
  [K in keyof T]?: ReactNode;
};

type ColumnDisplayMapping<T> = {
  [K in keyof T]?: (value: T[K]) => ReactNode;
};

type ColDef<T> = {
  id: string;
  header: ReactNode;
  cell: (props: { row: T }) => ReactNode;
};

export function TableInputViewComponent<T>({
  setValue,
  value,
  stateKey,
  columns,
  data,
  header,
  format,
  multiple,
  getRowId,
  wrapper,
  maxHeight = '300px',
  loading,
  ...props
}: TableInputProps<T> & ViewComponentProps<string[]>) {
  const colDefs = useMemo<ColDef<T>[]>(() => {
    const firstRow = data.at(0);
    const colKeys =
      columns ?? (Object.keys(firstRow ?? {}) as (keyof T & string)[]);
    const areAllRowsSelected = value.length === data.length;
    return [
      {
        id: '__select__',
        header: multiple ? (
          <Checkbox
            checked={areAllRowsSelected}
            onCheckedChange={() =>
              setValue(areAllRowsSelected ? [] : data.map(getRowId))
            }
          />
        ) : undefined,
        cell: ({ row }) => {
          const rowId = getRowId(row);
          if (loading) {
            return (
              <Skeleton>
                {multiple ? <Checkbox /> : <Radio value={getRowId(row)} />}
              </Skeleton>
            );
          } else if (multiple) {
            return (
              <Checkbox
                checked={value.includes(rowId)}
                onCheckedChange={() =>
                  setValue(
                    value.includes(rowId)
                      ? value.filter((r) => r !== rowId)
                      : [...value, rowId]
                  )
                }
              />
            );
          } else {
            return (
              <Radio
                name={stateKey}
                value={getRowId(row)}
                checked={getRowId(row) === value.at(0)}
                onValueChange={(v) => setValue([v])}
              />
            );
          }
        },
      },
      ...colKeys.map((key) => ({
        id: key,
        header: header?.[key] ?? userFriendlyName(key),
        cell: ({ row }) => {
          return format?.[key]?.(row[key]) ?? String(row[key]);
        },
      })),
    ];
  }, [data, columns, loading]);
  return applyWrapper(
    <ScrollArea
      type="auto"
      scrollbars="vertical"
      style={{ maxHeight: maxHeight }}
    >
      <Table.Root style={{ maxHeight: maxHeight }} size="1" {...props}>
        <Table.Header>
          <Table.Row>
            {colDefs.map((col) => (
              <Table.ColumnHeaderCell
                key={col.id}
                style={{
                  background: 'var(--color-panel-solid)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                {col.header}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, i) => (
            <Table.Row key={i}>
              {colDefs.map((col) => (
                <Table.Cell key={col.id}>{col.cell({ row })}</Table.Cell>
              ))}
            </Table.Row>
          ))}
          {loading &&
            data.length === 0 &&
            repeatElement(
              <Table.Row>
                {repeatElement(
                  <Table.Cell>
                    <Skeleton>Loading...</Skeleton>
                  </Table.Cell>,
                  colDefs.length
                )}
              </Table.Row>,
              3
            )}
          {!loading && data.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={colDefs.length}>No data</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </ScrollArea>,
    wrapper
  );
}

export function SingleTableInputViewComponent<T>({
  setValue,
  value,
  ...props
}: Omit<TableInputProps<T>, 'multiple'> &
  ViewComponentProps<string | undefined>) {
  return (
    <TableInputViewComponent<T>
      multiple={false}
      value={value ? [value] : []}
      setValue={(v) => {
        setValue(v?.at(0) ?? undefined);
      }}
      {...props}
    />
  );
}

export type TableViewDefinition<T, P> = P extends { multiple: true }
  ? ViewDefinition<string[], T[]>
  : ViewDefinition<string | undefined, T>;

export function TableInput<T, P extends Omit<TableInputProps<T>, 'data'>>(
  data: T[] | undefined,
  { multiple, ...props }: P
): TableViewDefinition<T, P> {
  if (multiple) {
    return defineTransformView<string[], T[]>(
      (viewProps) => (
        <TableInputViewComponent
          {...viewProps}
          data={data ?? []}
          multiple
          {...props}
        />
      ),
      ({ value }) => data.filter((row) => value.includes(props.getRowId(row)))
    ) as TableViewDefinition<T, P>;
  } else {
    return defineTransformView<string | undefined, T>(
      (viewProps) => (
        <SingleTableInputViewComponent
          {...viewProps}
          data={data ?? []}
          {...props}
        />
      ),
      ({ value }) => data.find((row) => props.getRowId(row) === value)
    ) as TableViewDefinition<T, P>;
  }
}
