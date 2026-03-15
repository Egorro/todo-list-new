import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSignal = signal<Todo[]>([]);
  readonly todos = this.todosSignal.asReadonly();

  getTodos(): Todo[] {
    return this.todosSignal();
  }

  addTodo(title: string): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false
    };
    this.todosSignal.update(todos => [...todos, todo]);
    return todo;
  }

  toggleTodo(id: string): void {
    this.todosSignal.update(todos =>
      todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  deleteTodo(id: string): void {
    this.todosSignal.update(todos => todos.filter(t => t.id !== id));
  }
}
