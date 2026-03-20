import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Todo } from './entities/todo.entity';
import { TODO_REPOSITORY, TodoRepository } from './repository/todo.repository';

type TodoFilter = 'all' | 'active' | 'completed';

@Injectable()
export class TodoService {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly repo: TodoRepository
  ) {}

  async getTodos(params: { filter?: string; q?: string }): Promise<Todo[]> {
    const filter = this.parseFilter(params.filter ?? 'all');
    const q = params.q?.trim() ?? '';
    const needle = q ? q.toLowerCase() : '';

    const todos = await this.repo.findAll();

    const byStatus =
      filter === 'all' ? todos :
      filter === 'active' ? todos.filter(t => !t.completed) :
      todos.filter(t => t.completed);

    if (!needle) return byStatus;

    return byStatus.filter(todo => todo.title.toLowerCase().includes(needle));
  }

  async create(title: string): Promise<Todo> {
    const normalizedTitle = this.normalizeTitle(title);
    return this.repo.create({ title: normalizedTitle });
  }

  async updateTitle(id: string, title: string): Promise<Todo> {
    const normalizedTitle = this.normalizeTitle(title);
    const updated = await this.repo.updateTitle(id, normalizedTitle);
    if (!updated) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return updated;
  }

  async toggleCompleted(id: string): Promise<Todo> {
    const updated = await this.repo.toggleCompleted(id);
    if (!updated) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const ok = await this.repo.delete(id);
    if (!ok) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
  }

  private normalizeTitle(title: string): string {
    const trimmed = title?.trim() ?? '';
    if (!trimmed) {
      throw new BadRequestException('title must not be empty');
    }
    if (trimmed.length < 1 || trimmed.length > 100) {
      throw new BadRequestException('title length must be between 1 and 100');
    }
    return trimmed;
  }

  private parseFilter(filter: string): TodoFilter {
    switch (filter) {
      case 'all':
        return 'all';
      case 'active':
        return 'active';
      case 'completed':
        return 'completed';
      default:
        throw new BadRequestException('filter must be one of: all, active, completed');
    }
  }
}

