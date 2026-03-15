import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';

describe('TodoItemComponent', () => {
  let fixture: ComponentFixture<TodoItemComponent>;
  let component: TodoItemComponent;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test todo',
    completed: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('todo', mockTodo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display todo title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test todo');
  });

  it('should apply completed class when todo is completed', () => {
    fixture.componentRef.setInput('todo', { ...mockTodo, completed: true });
    fixture.detectChanges();
    const li = fixture.nativeElement.querySelector('li');
    expect(li.classList.contains('completed')).toBe(true);
  });

  it('should emit toggle when checkbox is clicked', () => {
    const handler = vi.fn();
    component.toggle.subscribe(handler);

    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.dispatchEvent(new Event('change'));

    expect(handler).toHaveBeenCalledWith(mockTodo);
  });

  it('should emit delete when delete button is clicked', () => {
    const handler = vi.fn();
    component.delete.subscribe(handler);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(handler).toHaveBeenCalledWith(mockTodo);
  });
});
