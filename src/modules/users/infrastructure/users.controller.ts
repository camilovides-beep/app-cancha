import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/auth/jwt-auth.guard';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los usuarios' })
  findAll() {
    return this.users.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca un usuario por documento' })
  @ApiQuery({ name: 'document', required: true })
  async searchByDocument(@Query('document') document: string) {
    const user = await this.users.findByDocument(document);
    if (!user) throw new NotFoundException('No se encontró un usuario con ese documento');
    return user;
  }

  @Get('resolve-category')
  @ApiOperation({ summary: 'Resuelve categoría y tarifa base por documento' })
  @ApiQuery({ name: 'document', required: true })
  resolveCategory(@Query('document') document: string) {
    return this.users.resolveCategoryByDocument(document);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un usuario por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un usuario' })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un usuario (anonimiza sus reservas)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.delete(id);
  }
}
