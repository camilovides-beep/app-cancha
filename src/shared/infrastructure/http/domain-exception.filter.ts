import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ConflictException,
  DomainException,
  DomainValidationException,
  EntityNotFoundException,
  UnauthorizedDomainException,
} from '../../domain/exceptions/domain.exception';

/**
 * Traduce excepciones de dominio (y errores no controlados) a respuestas HTTP
 * coherentes. Mantiene el dominio libre de dependencias de HTTP.
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, message } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private resolve(exception: unknown): { status: number; message: string | string[] } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === 'string' ? res : ((res as Record<string, unknown>).message as string[]) ?? exception.message;
      return { status: exception.getStatus(), message };
    }
    if (exception instanceof EntityNotFoundException) {
      return { status: HttpStatus.NOT_FOUND, message: exception.message };
    }
    if (exception instanceof ConflictException) {
      return { status: HttpStatus.CONFLICT, message: exception.message };
    }
    if (exception instanceof DomainValidationException) {
      return { status: HttpStatus.UNPROCESSABLE_ENTITY, message: exception.message };
    }
    if (exception instanceof UnauthorizedDomainException) {
      return { status: HttpStatus.UNAUTHORIZED, message: exception.message };
    }
    if (exception instanceof DomainException) {
      return { status: HttpStatus.BAD_REQUEST, message: exception.message };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    };
  }
}
