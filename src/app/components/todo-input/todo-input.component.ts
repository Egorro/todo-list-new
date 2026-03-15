import { Component, output, signal, viewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-todo-input',
  standalone: true,
  templateUrl: './todo-input.component.html',
  styleUrl: './todo-input.component.scss'
})
export class TodoInputComponent {
  todoAdded = output<string>();
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('todoInput');

  protected onSubmit(): void {
    const input = this.inputRef()?.nativeElement;
    const value = input?.value?.trim();
    if (value) {
      this.todoAdded.emit(value);
      if (input) input.value = '';
    }
  }
}
