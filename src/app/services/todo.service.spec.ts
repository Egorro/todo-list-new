import { describe, it, expect, beforeEach } from 'vitest';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService();
  });

  it('should start with empty todos', () => {
    expect(service.getTodos()).toEqual([]);
  });

  it('should add a todo', () => {
    const todo = service.addTodo('Learn Angular testing');
    expect(todo.title).toBe('Learn Angular testing');
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeDefined();
    expect(service.getTodos()).toHaveLength(1);
    expect(service.getTodos()[0].title).toBe('Learn Angular testing');
  });

  it('should trim title when adding', () => {
    service.addTodo('  Trimmed  ');
    expect(service.getTodos()[0].title).toBe('Trimmed');
  });

  it('should toggle todo completed state', () => {
    const todo = service.addTodo('Test todo');
    expect(service.getTodos()[0].completed).toBe(false);
    service.toggleTodo(todo.id);
    expect(service.getTodos()[0].completed).toBe(true);
    service.toggleTodo(todo.id);
    expect(service.getTodos()[0].completed).toBe(false);
  });

  it('should delete a todo', () => {
    const todo = service.addTodo('To delete');
    expect(service.getTodos()).toHaveLength(1);
    service.deleteTodo(todo.id);
    expect(service.getTodos()).toHaveLength(0);
  });
});
