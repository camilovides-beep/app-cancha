import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(150) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) tagline?: string;

  @ApiPropertyOptional({ example: '#19559B' })
  @IsOptional() @IsHexColor()
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @IsOptional() @IsHexColor()
  primaryColorText?: string;

  @ApiPropertyOptional({ example: '#1FB5E5' })
  @IsOptional() @IsHexColor()
  secondaryColor?: string;

  @ApiPropertyOptional({ example: '#0F3461' })
  @IsOptional() @IsHexColor()
  secondaryColorText?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() whatsapp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() logo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() favicon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() facebook?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() instagram?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() twitter?: string;
}
