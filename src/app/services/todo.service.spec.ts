import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TodoService } from './todo.service';
import { TodoFacadeService } from './todo-facade.service';

describe('TodoService', () => {
  let service: TodoService;
  let facade: {
    todos: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    errorMessage: ReturnType<typeof signal>;
    getTodos: ReturnType<typeof vi.fn>;
    loadTodos: ReturnType<typeof vi.fn>;
    addTodo: ReturnType<typeof vi.fn>;
    toggleTodo: ReturnType<typeof vi.fn>;
    deleteTodo: ReturnType<typeof vi.fn>;
    updateTitle: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    facade = {
      todos: signal([]),
      isLoading: signal(false),
      errorMessage: signal(null),
      getTodos: vi.fn().mockReturnValue([]),
      loadTodos: vi.fn().mockResolvedValue(undefined),
      addTodo: vi.fn().mockResolvedValue(null),
      toggleTodo: vi.fn().mockResolvedValue(undefined),
      deleteTodo: vi.fn().mockResolvedValue(undefined),
      updateTitle: vi.fn().mockResolvedValue(undefined)
    };
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: TodoFacadeService, useValue: facade }
      ]
    });
    service = TestBed.inject(TodoService);
  });

  it('должен проксировать загрузку задач во facade', async () => {
    await service.loadTodos('all');
    expect(facade.loadTodos).toHaveBeenCalledWith('all', '');
  });

  it('должен проксировать добавление задачи во facade', async () => {
    await service.addTodo('Тест');
    expect(facade.addTodo).toHaveBeenCalledWith('Тест');
  });

  it('должен проксировать изменение заголовка во facade', async () => {
    await service.updateTitle('1', 'Новое');
    expect(facade.updateTitle).toHaveBeenCalledWith('1', 'Новое');
  });
});
