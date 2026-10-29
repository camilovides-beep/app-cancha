import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString() @MinLength(2) @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail({}, { message: 'Correo inválido' })
  email!: string;

  @ApiPropertyOptional({ example: '3001112233' })
  @IsOptional() @IsString() @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ enum: ['A', 'B', 'C', 'D'], default: 'D' })
  @IsOptional() @IsIn(['A', 'B', 'C', 'D'])
  category?: string;

  @ApiPropertyOptional({ example: '1102233445' })
  @IsOptional() @IsString() @MaxLength(50)
  documentNumber?: string;

  @ApiPropertyOptional({ enum: ['CC', 'TI', 'CE', 'PA'], default: 'CC' })
  @IsOptional() @IsIn(['CC', 'TI', 'CE', 'PA'])
  documentType?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional() @IsIn(['active', 'inactive'])
  status?: string;
}
