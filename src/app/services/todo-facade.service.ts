import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Todo } from '../models/todo.model';
import { TodoApiService, TodoFilter } from './todo-api.service';

@Injectable({
  providedIn: 'root'
})
export class TodoFacadeService {
  private readonly todosSignal = signal<Todo[]>([]);
  readonly todos = this.todosSignal.asReadonly();
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor(private readonly api: TodoApiService) {}

  getTodos(): Todo[] {
    return this.todosSignal();
  }

  async loadTodos(filter: TodoFilter = 'all', q = ''): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const todos = await firstValueFrom(this.api.getTodos(filter, q));
      this.todosSignal.set(todos);
    } catch {
      this.errorMessage.set('Не удалось загрузить задачи');
    } finally {
      this.isLoading.set(false);
    }
  }

  async addTodo(title: string): Promise<Todo | null> {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return null;

    this.errorMessage.set(null);
    try {
      const created = await firstValueFrom(this.api.createTodo(trimmedTitle));
      this.todosSignal.update(todos => [...todos, created]);
      return created;
    } catch {
      this.errorMessage.set('Не удалось добавить задачу');
      return null;
    }
  }

  async toggleTodo(id: string): Promise<void> {
    this.errorMessage.set(null);
    try {
      const updated = await firstValueFrom(this.api.toggleTodo(id));
      this.todosSignal.update(todos => todos.map(t => (t.id === id ? updated : t)));
    } catch {
      this.errorMessage.set('Не удалось изменить статус задачи');
    }
  }

  async deleteTodo(id: string): Promise<void> {
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.api.deleteTodo(id));
      this.todosSignal.update(todos => todos.filter(t => t.id !== id));
    } catch {
      this.errorMessage.set('Не удалось удалить задачу');
    }
  }

  async updateTitle(id: string, newTitle: string): Promise<void> {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    this.errorMessage.set(null);
    try {
      const updated = await firstValueFrom(this.api.updateTitle(id, trimmedTitle));
      this.todosSignal.update(todos => todos.map(t => (t.id === id ? updated : t)));
    } catch {
      this.errorMessage.set('Не удалось обновить название задачи');
    }
  }
}

