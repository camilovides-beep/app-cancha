import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';

class SlotRatesDto {
  @ApiPropertyOptional({ description: 'Tarifa franja día (06:00–11:59)' })
  @IsOptional() @IsNumber() @Min(0)
  day?: number;

  @ApiPropertyOptional({ description: 'Tarifa franja tarde (12:00–17:59)' })
  @IsOptional() @IsNumber() @Min(0)
  afternoon?: number;

  @ApiPropertyOptional({ description: 'Tarifa franja noche (18:00–05:59)' })
  @IsOptional() @IsNumber() @Min(0)
  night?: number;
}

/** Tarifas por categoría (A/B/C/D) y franja horaria. */
export class RateMatrixDto {
  @ApiPropertyOptional({ type: SlotRatesDto })
  @IsOptional() @ValidateNested() @Type(() => SlotRatesDto)
  A?: SlotRatesDto;

  @ApiPropertyOptional({ type: SlotRatesDto })
  @IsOptional() @ValidateNested() @Type(() => SlotRatesDto)
  B?: SlotRatesDto;

  @ApiPropertyOptional({ type: SlotRatesDto })
  @IsOptional() @ValidateNested() @Type(() => SlotRatesDto)
  C?: SlotRatesDto;

  @ApiPropertyOptional({ type: SlotRatesDto })
  @IsOptional() @ValidateNested() @Type(() => SlotRatesDto)
  D?: SlotRatesDto;
}
