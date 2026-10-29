import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { RateMatrixDto } from './rate-matrix.dto';

export class CreateCourtDto {
  @ApiProperty({ example: 'Cancha Sintética Principal' })
  @IsString() @MinLength(2) @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 'Fútbol' })
  @IsString() @MinLength(2) @MaxLength(100)
  sportType!: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'maintenance'], default: 'active' })
  @IsOptional() @IsIn(['active', 'inactive', 'maintenance'])
  status?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() courtType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() venueName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() additionalInfo?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  attributes?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  venueServices?: string[];

  @ApiPropertyOptional({ description: 'Tarifa por hora base (respaldo)' })
  @IsOptional() @IsNumber() @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({ type: RateMatrixDto })
  @IsOptional() @ValidateNested() @Type(() => RateMatrixDto)
  rates?: RateMatrixDto;
}
