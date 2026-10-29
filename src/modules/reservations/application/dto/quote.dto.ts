import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

/** Solicitud de cotización (previsualización de precio) antes de reservar. */
export class QuoteDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  courtId!: string;

  @ApiProperty({ example: '2026-11-15' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @ApiProperty({ example: '18:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime!: string;

  @ApiProperty({ example: '19:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime!: string;

  @ApiPropertyOptional({ enum: ['A', 'B', 'C', 'D'] })
  @IsOptional() @IsIn(['A', 'B', 'C', 'D'])
  category?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  documentNumber?: string;
}
