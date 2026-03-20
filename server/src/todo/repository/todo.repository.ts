import { Todo } from '../entities/todo.entity';

export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');

export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(data: { title: string }): Promise<Todo>;
  updateTitle(id: string, title: string): Promise<Todo | null>;
  toggleCompleted(id: string): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}

