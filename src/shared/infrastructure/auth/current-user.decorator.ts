import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: number;
  username: string;
  role: string;
}

/** Inyecta el administrador autenticado (extraído del JWT) en el controlador. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserData => {
    return ctx.switchToHttp().getRequest().user;
  },
);
