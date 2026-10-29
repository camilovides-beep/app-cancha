import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard reutilizable que exige un JWT válido. Protege los endpoints del panel. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
