import { Main } from '@/components/main';
import { Spinner } from '@radix-ui/themes';
import { DataFetchingPlugin, Reactlit } from '@reactlit/core';
import { DefaultWrapper, Inputs } from '@reactlit/radix';
import tunnel from 'tunnel-rat';
import { TodoService } from '../../mocks/todos';

export const Loader = ({ message }: { message: string }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Spinner /> {message}
    </div>
  );
};

const api = new TodoService([], 1000);

const c1 = tunnel();
const c2 = tunnel();

export default function TodoList() {
  return (
    <Main>
      <Reactlit plugins={[DataFetchingPlugin] as const}>
        {async ({ display, view, set, changed, fetcher }) => {
          const todosFetcher = fetcher(['todos'], () => api.getTodos());
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
            display(
              <DefaultWrapper>
                <div className="grid grid-cols-3 gap-4">
                  <DefaultWrapper>
                    <c1.Out />
                  </DefaultWrapper>
                  <DefaultWrapper>
                    <c2.Out />
                  </DefaultWrapper>
                </div>
              </DefaultWrapper>
            );
            const task = view(
              'task',
              Inputs.Text({
                label: 'Task',
                wrapper: (children) => <c1.In>{children}</c1.In>,
              })
            );
            const completed = view(
              'completed',
              Inputs.Switch({
                label: 'Completed',
                wrapper: (children) => <c2.In>{children}</c2.In>,
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
    </Main>
  );
}
