import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Usuario o correo del administrador' })
  @IsString()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  username!: string;

  @ApiProperty({ example: 'Comfasucre2025*' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password!: string;
}
