import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Salud')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Estado del servicio' })
  health() {
    return { status: 'ok', service: 'cancha-backend', timestamp: new Date().toISOString() };
  }
}
