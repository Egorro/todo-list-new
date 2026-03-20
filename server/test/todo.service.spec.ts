import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Todo } from '../src/todo/entities/todo.entity';
import { TODO_REPOSITORY, TodoRepository } from '../src/todo/repository/todo.repository';
import { TodoService } from '../src/todo/todo.service';

class InMemoryRepo implements TodoRepository {
  private store = new Map<string, Todo>();
  private seq = 1;

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values()).map(t => ({ ...t }));
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.store.get(id);
    return todo ? { ...todo } : null;
  }

  async create(data: { title: string }): Promise<Todo> {
    const id = String(this.seq++);
    const todo: Todo = { id, title: data.title, completed: false };
    this.store.set(id, todo);
    return { ...todo };
  }

  async updateTitle(id: string, title: string): Promise<Todo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Todo = { ...existing, title };
    this.store.set(id, updated);
    return { ...updated };
  }

  async toggleCompleted(id: string): Promise<Todo | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: Todo = { ...existing, completed: !existing.completed };
    this.store.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}

describe('TodoService', () => {
  let service: TodoService;
  let repo: InMemoryRepo;

  beforeEach(() => {
    repo = new InMemoryRepo();
    service = new TodoService(repo as unknown as any, TODO_REPOSITORY as any);
  });

  it('creates todo with trimmed title', async () => {
    const todo = await service.create('  test  ');
    expect(todo.title).toBe('test');
    expect(todo.completed).toBe(false);
  });

  it('throws on empty title', async () => {
    await expect(service.create('   ')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('updates title', async () => {
    const todo = await service.create('old');
    const updated = await service.updateTitle(todo.id, 'new');
    expect(updated.title).toBe('new');
  });

  it('throws 404 when updating missing', async () => {
    await expect(service.updateTitle('missing', 'x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('toggles completed flag', async () => {
    const todo = await service.create('t');
    const t1 = await service.toggleCompleted(todo.id);
    expect(t1.completed).toBe(true);
    const t2 = await service.toggleCompleted(todo.id);
    expect(t2.completed).toBe(false);
  });

  it('throws 404 on toggle missing', async () => {
    await expect(service.toggleCompleted('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes todo', async () => {
    const todo = await service.create('t');
    await service.delete(todo.id);
    await expect(service.delete(todo.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('filters by status and query', async () => {
    const t1 = await service.create('Buy milk');
    const t2 = await service.create('Read book');
    await service.toggleCompleted(t2.id);

    const all = await service.getTodos({ filter: 'all', q: '' });
    expect(all).toHaveLength(2);

    const active = await service.getTodos({ filter: 'active', q: '' });
    expect(active).toHaveLength(1);
    expect(active[0].id).toBe(t1.id);

    const completed = await service.getTodos({ filter: 'completed', q: '' });
    expect(completed).toHaveLength(1);
    expect(completed[0].id).toBe(t2.id);

    const searched = await service.getTodos({ filter: 'all', q: 'book' });
    expect(searched).toHaveLength(1);
    expect(searched[0].id).toBe(t2.id);
  });
}

