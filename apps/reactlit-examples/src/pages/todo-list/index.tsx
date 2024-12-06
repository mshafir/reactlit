import { Main } from '@/components/main';
import { Spinner } from '@radix-ui/themes';
import { Reactlit } from '@reactlit/core';
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

class LocalCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cacheData = new Map<string, any>();

  async cache<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.cacheData.has(key)) {
      return this.cacheData.get(key);
    }
    const result = await fn();
    this.cacheData.set(key, result);
    return result;
  }

  invalidate(key?: string) {
    if (key) {
      this.cacheData.delete(key);
    } else {
      this.cacheData.clear();
    }
  }
}

const cache = new LocalCache();
const api = new TodoService([], 1000);

export default function TodoList() {
  return (
    <Main>
      <Reactlit>
        {async ({ display, view, trigger, set, changed }) => {
          view(
            'adding',
            Inputs.AsyncButton(
              async () => {
                const newTodo = await api.addTodo();
                set('selectedTodo', newTodo.id);
                cache.invalidate('todos');
              },
              {
                content: 'Add Todo',
              }
            )
          );
          display('loading', <Loader message="Loading todos..." />);
          const todos = await cache.cache('todos', api.getTodos);
          display('loading', undefined);
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
            const c1 = tunnel();
            const c2 = tunnel();
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
                  await api.updateTodo(selectedTodo.id, { task, completed });
                  cache.invalidate('todos');
                  trigger();
                },
                {
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
