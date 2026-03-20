import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';

import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@ApiTags('todos')
@Controller('api/v1/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of todos' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter by completion status',
    enum: ['all', 'active', 'completed']
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Case-insensitive substring search by title'
  })
  @ApiOkResponse({ type: Todo, isArray: true })
  getTodos(
    @Query('filter') filter?: string,
    @Query('q') q?: string
  ): Promise<Todo[]> {
    return this.todoService.getTodos({ filter, q });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiCreatedResponse({ type: Todo })
  createTodo(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(dto.title);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo title' })
  @ApiOkResponse({ type: Todo })
  updateTitle(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto
  ): Promise<Todo> {
    return this.todoService.updateTitle(id, dto.title);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle todo completion' })
  @ApiOkResponse({ type: Todo })
  toggleCompleted(@Param('id') id: string): Promise<Todo> {
    return this.todoService.toggleCompleted(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete todo' })
  @ApiNoContentResponse()
  deleteTodo(@Param('id') id: string): Promise<void> {
    return this.todoService.delete(id);
  }
}

