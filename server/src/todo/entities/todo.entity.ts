import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty()
  id!: string;

  @ApiProperty({ minLength: 1, maxLength: 100 })
  title!: string;

  @ApiProperty()
  completed!: boolean;
}

