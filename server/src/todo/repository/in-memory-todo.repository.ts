import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { Todo } from '../entities/todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class InMemoryTodoRepository implements TodoRepository {
  private readonly todos = new Map<string, Todo>();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values()).map(todo => ({ ...todo }));
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.get(id);
    return todo ? { ...todo } : null;
  }

  async create(data: { title: string }): Promise<Todo> {
    const id = randomUUID();
    const todo: Todo = {
      id,
      title: data.title,
      completed: false
    };

    this.todos.set(id, todo);
    return { ...todo };
  }

  async updateTitle(id: string, title: string): Promise<Todo | null> {
    const existing = this.todos.get(id);
    if (!existing) return null;

    const updated: Todo = { ...existing, title };
    this.todos.set(id, updated);
    return { ...updated };
  }

  async toggleCompleted(id: string): Promise<Todo | null> {
    const existing = this.todos.get(id);
    if (!existing) return null;

    const updated: Todo = { ...existing, completed: !existing.completed };
    this.todos.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }
}

