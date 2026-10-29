import { PartialType } from '@nestjs/swagger';
import { CreateCourtDto } from './create-court.dto';

/** Todos los campos opcionales para actualización parcial. */
export class UpdateCourtDto extends PartialType(CreateCourtDto) {}
