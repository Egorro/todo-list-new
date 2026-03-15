import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoFilterPipe, TodoFilter } from '../../pipes/todo-filter.pipe';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoFilterPipe, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  protected filter = signal<TodoFilter>('all');
  protected todos = this.todoService.todos;

  protected setFilter(f: TodoFilter): void {
    this.filter.set(f);
  }

  protected onToggle(todo: Todo): void {
    this.todoService.toggleTodo(todo.id);
  }

  protected onDelete(todo: Todo): void {
    this.todoService.deleteTodo(todo.id);
  }
}
