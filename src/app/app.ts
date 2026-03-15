import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoInputComponent } from './components/todo-input/todo-input.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoInputComponent, TodoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private todoService = inject(TodoService);

  protected onTodoAdded(title: string): void {
    this.todoService.addTodo(title);
  }
}
