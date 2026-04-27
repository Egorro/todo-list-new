import { signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let mockTodoService: Pick<
    TodoService,
    'todos' | 'isLoading' | 'errorMessage' | 'toggleTodo' | 'deleteTodo' | 'updateTitle'
  >;

  const sampleTodos: Todo[] = [
    { id: '1', title: 'Todo 1', completed: false },
    { id: '2', title: 'Todo 2', completed: true }
  ];

  beforeEach(async () => {
    mockTodoService = {
      todos: signal([...sampleTodos]),
      isLoading: signal(false),
      errorMessage: signal(null),
      toggleTodo: vi.fn().mockResolvedValue(undefined),
      deleteTodo: vi.fn().mockResolvedValue(undefined),
      updateTitle: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: mockTodoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен создаваться', () => {
    expect(component).toBeTruthy();
  });

  it('должен отображать кнопки фильтра', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('All');
    expect(el.textContent).toContain('Active');
    expect(el.textContent).toContain('Completed');
  });

  it('должен отображать список задач', () => {
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(2);
  });

  it('должен фильтровать активные задачи при выборе Active', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.filters button');
    buttons[1].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(1);
  });

  it('должен фильтровать выполненные задачи при выборе Completed', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.filters button');
    buttons[2].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(1);
  });

  it('должен показывать количество незавершенных задач', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.summary')?.textContent).toContain('1 items left');
  });

  it('должен показывать состояние загрузки', () => {
    mockTodoService.isLoading.set(true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Загрузка задач...');
  });

  it('должен показывать текст ошибки', () => {
    mockTodoService.errorMessage.set('Ошибка загрузки');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Ошибка загрузки');
  });
});
