// This is mocking a backend API for demo purposes

import { wait } from '../utils/wait';

export type Todo = {
  id: string;
  task: string;
  completed: boolean;
};

// we add a delay to these to simulate a network request
export class TodoService {
  constructor(private todos: Todo[], private readonly delay: number = 0) {}

  async getTodos() {
    await wait(this.delay);
    return this.todos;
  }

  async addTodo(todo?: Partial<Omit<Todo, 'id'>>) {
    await wait(this.delay);
    const newTodo = {
      task: `New Todo ${this.todos.length + 1}`,
      completed: false,
      ...(todo ?? {}),
      id: `todo-${this.todos.length + 1}`,
    };
    this.todos = [...this.todos, newTodo];
    return newTodo;
  }

  async updateTodo(id: string, todo: Partial<Todo>) {
    await wait(this.delay);
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Todo not found: ${id}`);
    }
    this.todos = [
      ...this.todos.slice(0, index),
      { ...this.todos[index], ...todo },
      ...this.todos.slice(index + 1),
    ];
    return this.todos[index];
  }
}
