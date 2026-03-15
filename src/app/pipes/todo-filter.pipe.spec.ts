import { describe, it, expect } from 'vitest';
import { TodoFilterPipe } from './todo-filter.pipe';
import { Todo } from '../models/todo.model';

describe('TodoFilterPipe', () => {
  const pipe = new TodoFilterPipe();
  const todos: Todo[] = [
    { id: '1', title: 'Active 1', completed: false },
    { id: '2', title: 'Active 2', completed: false },
    { id: '3', title: 'Completed 1', completed: true }
  ];

  it('should return all todos for "all" filter', () => {
    expect(pipe.transform(todos, 'all')).toEqual(todos);
    expect(pipe.transform(todos, 'all')).toHaveLength(3);
  });

  it('should return only active todos for "active" filter', () => {
    const result = pipe.transform(todos, 'active');
    expect(result).toHaveLength(2);
    expect(result.every(t => !t.completed)).toBe(true);
  });

  it('should return only completed todos for "completed" filter', () => {
    const result = pipe.transform(todos, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  it('should return empty array for null or undefined', () => {
    expect(pipe.transform(null, 'all')).toEqual([]);
    expect(pipe.transform(undefined, 'all')).toEqual([]);
  });
});
