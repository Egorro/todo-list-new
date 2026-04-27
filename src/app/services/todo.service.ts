import { Injectable, inject } from '@angular/core';

import { Todo } from '../models/todo.model';
import { TodoFacadeService } from './todo-facade.service';
import { TodoFilter } from './todo-api.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly facade = inject(TodoFacadeService);

  readonly todos = this.facade.todos;
  readonly isLoading = this.facade.isLoading;
  readonly errorMessage = this.facade.errorMessage;

  getTodos(): Todo[] {
    return this.facade.getTodos();
  }

  loadTodos(filter: TodoFilter = 'all', q = ''): Promise<void> {
    return this.facade.loadTodos(filter, q);
  }

  addTodo(title: string): Promise<Todo | null> {
    return this.facade.addTodo(title);
  }

  toggleTodo(id: string): Promise<void> {
    return this.facade.toggleTodo(id);
  }

  deleteTodo(id: string): Promise<void> {
    return this.facade.deleteTodo(id);
  }

  updateTitle(id: string, newTitle: string): Promise<void> {
    return this.facade.updateTitle(id, newTitle);
  }
}
