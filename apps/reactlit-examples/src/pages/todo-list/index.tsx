import { Button, Callout, Spinner } from '@radix-ui/themes';
import { DataFetchingPlugin, useReactlit } from '@reactlit/core';
import { DefaultRadixWrapper, Inputs } from '@reactlit/radix';
import { InfoIcon } from 'lucide-react';
import { TodoService } from '../../mocks/todos';

export const Loader = ({ message }: { message: string }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Spinner /> {message}
    </div>
  );
};

const api = new TodoService([], 1000);

export default function TodoList() {
  const Reactlit = useReactlit(DataFetchingPlugin);
  return (
    <DefaultRadixWrapper>
      <Reactlit>
        {async ({ display, view, set, changed, fetcher }) => {
          display(
            <Callout.Root>
              <Callout.Icon>
                <InfoIcon />
              </Callout.Icon>
              <Callout.Text>
                This app is purposely slow to show how Reactlit handles loading
                states.
              </Callout.Text>
            </Callout.Root>
          );
          const todosFetcher = fetcher(['todos'], () => api.getTodos());
          display(
            <div>
              <Button onClick={() => todosFetcher.refetch()}>Refetch</Button>
            </div>
          );
          view(
            'adding',
            Inputs.AsyncButton(
              async () => {
                const newTodo = await api.addTodo();
                await todosFetcher.refetch();
                set('selectedTodo', newTodo.id);
              },
              {
                disabled: todosFetcher.isFetching(),
                content: 'Add Todo',
              }
            )
          );
          const todos = todosFetcher.get() ?? [];
          const selectedTodo = view(
            'selectedTodo',
            Inputs.Table(todos, {
              getRowId: (todo) => todo.id,
              columns: ['task', 'completed'],
              format: {
                completed: (completed) => (completed ? '☑️' : ''),
              },
            })
          );
          if (selectedTodo) {
            if (changed('selectedTodo')) {
              set('task', selectedTodo.task);
              set('completed', selectedTodo.completed);
            }
            const task = view(
              'task',
              Inputs.Text({
                label: 'Task',
              })
            );
            const completed = view(
              'completed',
              Inputs.Switch({
                label: 'Completed',
              })
            );
            view(
              'updaing',
              Inputs.AsyncButton(
                async () => {
                  // todosFetcher.update((todos) => {
                  //   return todos.map((todo) =>
                  //     todo.id === selectedTodo.id
                  //       ? { ...todo, task, completed }
                  //       : todo
                  //   );
                  // });
                  await api.updateTodo(selectedTodo.id, { task, completed });
                  await todosFetcher.refetch();
                },
                {
                  disabled: todosFetcher.isFetching(),
                  content: 'Update',
                }
              )
            );
          }
        }}
      </Reactlit>
    </DefaultRadixWrapper>
  );
}
