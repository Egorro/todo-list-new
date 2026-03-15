import { signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;
  let mockTodoService: Pick<TodoService, 'todos' | 'toggleTodo' | 'deleteTodo'>;

  const sampleTodos: Todo[] = [
    { id: '1', title: 'Todo 1', completed: false },
    { id: '2', title: 'Todo 2', completed: true }
  ];

  beforeEach(async () => {
    mockTodoService = {
      todos: signal([...sampleTodos]),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: mockTodoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display filter buttons', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('All');
    expect(el.textContent).toContain('Active');
    expect(el.textContent).toContain('Completed');
  });

  it('should render todo items', () => {
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(2);
  });

  it('should filter active when Active is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.filters button');
    buttons[1].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(1);
  });

  it('should filter completed when Completed is clicked', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.filters button');
    buttons[2].click();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-todo-item');
    expect(items.length).toBe(1);
  });
});
