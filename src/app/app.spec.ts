import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { App } from './app';
import { TodoService } from './services/todo.service';

describe('App', () => {
  beforeEach(async () => {
    const todoServiceMock: Pick<
      TodoService,
      'todos' | 'isLoading' | 'errorMessage' | 'loadTodos' | 'addTodo' | 'toggleTodo' | 'deleteTodo' | 'updateTitle'
    > = {
      todos: signal([]),
      isLoading: signal(false),
      errorMessage: signal(null),
      loadTodos: vi.fn().mockResolvedValue(undefined),
      addTodo: vi.fn().mockResolvedValue(null),
      toggleTodo: vi.fn().mockResolvedValue(undefined),
      deleteTodo: vi.fn().mockResolvedValue(undefined),
      updateTitle: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: TodoService, useValue: todoServiceMock }]
    }).compileComponents();
  });

  it('должен создавать приложение', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('должен отображать заголовок списка задач', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Todo List');
  });

  it('должен отображать ввод задачи и список задач', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-todo-input')).toBeTruthy();
    expect(compiled.querySelector('app-todo-list')).toBeTruthy();
  });
});
