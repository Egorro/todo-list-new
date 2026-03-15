import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { TodoInputComponent } from './todo-input.component';

describe('TodoInputComponent', () => {
  let fixture: ComponentFixture<TodoInputComponent>;
  let component: TodoInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit todoAdded when form is submitted with value', () => {
    const handler = vi.fn();
    component.todoAdded.subscribe(handler);

    const input = fixture.nativeElement.querySelector('input');
    const form = fixture.nativeElement.querySelector('form');

    input.value = 'New todo';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    fixture.detectChanges();

    expect(handler).toHaveBeenCalledWith('New todo');
    expect(input.value).toBe('');
  });

  it('should not emit when input is empty', () => {
    const handler = vi.fn();
    component.todoAdded.subscribe(handler);

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should trim whitespace', () => {
    const handler = vi.fn();
    component.todoAdded.subscribe(handler);

    const input = fixture.nativeElement.querySelector('input');
    const form = fixture.nativeElement.querySelector('form');

    input.value = '  Trimmed todo  ';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(handler).toHaveBeenCalledWith('Trimmed todo');
  });
});
