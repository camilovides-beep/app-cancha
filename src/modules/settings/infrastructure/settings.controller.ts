import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/auth/jwt-auth.guard';
import { SettingsService } from '../application/settings.service';
import { UpdateBrandDto } from '../application/dto/update-brand.dto';

@ApiTags('Configuración')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get('brand')
  @ApiOperation({ summary: 'Obtiene la configuración de marca' })
  getBrand() {
    return this.settings.getBrand();
  }

  @Put('brand')
  @ApiOperation({ summary: 'Actualiza la configuración de marca' })
  updateBrand(@Body() dto: UpdateBrandDto) {
    return this.settings.updateBrand(dto);
  }
}
