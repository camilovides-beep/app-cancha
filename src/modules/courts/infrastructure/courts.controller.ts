import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/auth/jwt-auth.guard';
import { CourtsService } from '../application/courts.service';
import { courtToView } from '../application/court.mapper';
import { CreateCourtDto } from '../application/dto/create-court.dto';
import { UpdateCourtDto } from '../application/dto/update-court.dto';

/** Endpoints de administración de canchas (protegidos con JWT). */
@ApiTags('Canchas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courts')
export class CourtsController {
  constructor(private readonly courts: CourtsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas las canchas' })
  async findAll() {
    return (await this.courts.findAll()).map(courtToView);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una cancha por id' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return courtToView(await this.courts.findById(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crea una cancha' })
  async create(@Body() dto: CreateCourtDto) {
    return courtToView(await this.courts.create(dto));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una cancha' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCourtDto) {
    return courtToView(await this.courts.update(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina una cancha' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.courts.delete(id);
  }
}
