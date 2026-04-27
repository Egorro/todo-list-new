import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { TodoApiService } from './todo-api.service';
import { TodoFacadeService } from './todo-facade.service';

describe('TodoFacadeService', () => {
  let service: TodoFacadeService;
  let api: {
    getTodos: ReturnType<typeof vi.fn>;
    createTodo: ReturnType<typeof vi.fn>;
    updateTitle: ReturnType<typeof vi.fn>;
    toggleTodo: ReturnType<typeof vi.fn>;
    deleteTodo: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = {
      getTodos: vi.fn(),
      createTodo: vi.fn(),
      updateTitle: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn()
    };
    service = new TodoFacadeService(api as unknown as TodoApiService);
  });

  it('должен загружать задачи и сохранять их в signal', async () => {
    const todos = [{ id: '1', title: 'Задача', completed: false }];
    api.getTodos.mockReturnValue(of(todos));

    await service.loadTodos();

    expect(service.getTodos()).toEqual(todos);
    expect(service.errorMessage()).toBeNull();
    expect(service.isLoading()).toBe(false);
  });

  it('должен добавлять задачу через api и обновлять список', async () => {
    api.createTodo.mockReturnValue(of({ id: '2', title: 'Новая', completed: false }));

    await service.addTodo('Новая');

    expect(service.getTodos()).toEqual([{ id: '2', title: 'Новая', completed: false }]);
  });

  it('должен сохранять сообщение об ошибке при падении загрузки', async () => {
    api.getTodos.mockReturnValue(throwError(() => new Error('fail')));

    await service.loadTodos();

    expect(service.errorMessage()).toBe('Не удалось загрузить задачи');
  });
});

