import { Component, input, output, signal } from '@angular/core';
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
  edit = output<Todo>();

  protected isEditing = signal(false);
  protected editTitle = signal('');

  protected onToggle(): void {
    this.toggle.emit(this.todo());
  }

  protected onDelete(): void {
    this.delete.emit(this.todo());
  }

  protected startEdit(): void {
    this.isEditing.set(true);
    this.editTitle.set(this.todo().title);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
    this.editTitle.set('');
  }

  protected saveEdit(): void {
    const title = this.editTitle().trim();
    if (!title || title === this.todo().title) {
      this.cancelEdit();
      return;
    }

    this.edit.emit({ ...this.todo(), title });
    this.isEditing.set(false);
  }

  protected onEditInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.editTitle.set(value);
  }
}
