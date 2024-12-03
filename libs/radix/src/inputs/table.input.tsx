import { Checkbox, Radio, ScrollArea, Table } from '@radix-ui/themes';
import {
  applyWrapper,
  defReturn,
  ViewComponentProps,
  ViewDefinition,
} from '@reactlit/core';
import { ReactNode, useMemo } from 'react';
import { BaseProps } from '../config';
import { userFriendlyName } from '../utils/user-friendly-name';

export type TableInputProps<T> = Table.RootProps &
  BaseProps & {
    data: T[];
    getRowId: (row: T) => string;
    columns?: (keyof T & string)[];
    header?: ColumnHeaderMapping<T>;
    format?: ColumnDisplayMapping<T>;
    maxHeight?: string;
    multiple?: boolean;
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
  ...props
}: TableInputProps<T> & ViewComponentProps<string[]>) {
  const colDefs = useMemo<ColDef<T>[]>(() => {
    const firstRow = data.at(0);
    if (!firstRow) {
      return [];
    }
    const colKeys = columns ?? (Object.keys(data[0]) as (keyof T & string)[]);
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
          if (multiple) {
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
                onValueChange={(v) => setValue([v])}
              />
            );
          }
        },
      },
      ...colKeys.map((key) => ({
        id: key,
        header: header?.[key] ?? userFriendlyName(key),
        cell: ({ row }) => format?.[key]?.(row[key]) ?? String(row[key]),
      })),
    ];
  }, [data, columns]);
  return applyWrapper(
    <ScrollArea type="auto" scrollbars="vertical" style={{ height: maxHeight }}>
      <Table.Root style={{ height: maxHeight }} size="1" {...props}>
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
  ? ViewDefinition<string[], T[], P & { data: T[] }>
  : ViewDefinition<string | undefined, T, P & { data: T[] }>;

export function TableInput<T, P extends Omit<TableInputProps<T>, 'data'>>(
  data: T[] | undefined,
  { multiple, ...props }: P
): TableViewDefinition<T, P> {
  if (multiple) {
    return defReturn(
      TableInputViewComponent,
      { data: data ?? [], multiple: true, ...props },
      (rowIds, { data, getRowId }) =>
        data.filter((row) => rowIds.includes(getRowId(row)))
    ) as TableViewDefinition<T, P>;
  } else {
    return defReturn(
      SingleTableInputViewComponent,
      { data: data ?? [], ...props },
      (rowId, { data, getRowId }) => data.find((row) => getRowId(row) === rowId)
    ) as TableViewDefinition<T, P>;
  }
}
