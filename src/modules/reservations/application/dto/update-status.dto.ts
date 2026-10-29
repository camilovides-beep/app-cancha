import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Length } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled', 'completed'] })
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed'])
  status!: string;
}

export class VerifyCodeDto {
  @ApiProperty({ example: '123456', description: 'Código de verificación de 4 a 6 dígitos' })
  @IsString()
  @Length(4, 6)
  code!: string;
}
