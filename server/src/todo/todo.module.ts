import { Module } from '@nestjs/common';

import { InMemoryTodoRepository } from './repository/in-memory-todo.repository';
import { TODO_REPOSITORY } from './repository/todo.repository';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [
    TodoService,
    { provide: TODO_REPOSITORY, useClass: InMemoryTodoRepository }
  ],
  exports: [TodoService]
})
export class TodoModule {}

