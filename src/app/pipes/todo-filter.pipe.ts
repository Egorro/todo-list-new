import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/todo.model';

export type TodoFilter = 'all' | 'active' | 'completed';

@Pipe({
  name: 'todoFilter',
  standalone: true
})
export class TodoFilterPipe implements PipeTransform {
  transform(todos: Todo[] | null | undefined, filter: TodoFilter): Todo[] {
    if (!todos) return [];
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }
}
