import { Component, input, output } from '@angular/core';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggle = output<Todo>();
  delete = output<Todo>();

  protected onToggle(): void {
    this.toggle.emit(this.todo());
  }

  protected onDelete(): void {
    this.delete.emit(this.todo());
  }
}
