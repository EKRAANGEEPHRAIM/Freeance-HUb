import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = this.getStatus(exception.code);

    response.status(status).json({
      statusCode: status,
      message: this.getMessage(exception.code),
    });
  }

  private getStatus(code: string): HttpStatus {
    if (code === 'P2002') {
      return HttpStatus.CONFLICT;
    }

    if (code === 'P2025') {
      return HttpStatus.NOT_FOUND;
    }

    if (code === 'P2003') {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(code: string): string {
    if (code === 'P2002') {
      return 'A record with these values already exists';
    }

    if (code === 'P2025') {
      return 'Record not found';
    }

    if (code === 'P2003') {
      return 'The related record does not exist';
    }

    return 'An unexpected database error occurred';
  }
}
