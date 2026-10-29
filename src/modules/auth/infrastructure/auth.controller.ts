import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../../../shared/infrastructure/auth/current-user.decorator';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicia sesión y devuelve un JWT' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devuelve el administrador autenticado' })
  me(@CurrentUser() user: CurrentUserData) {
    return this.auth.findAuthenticated(user.id);
  }
}
