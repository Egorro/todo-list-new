import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('api/health')
export class HealthController {
  @Get()
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Backend is alive',
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  getIsHealth() {
    return { status: 'ok' };
  }
}
