import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: any = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.getResponse(); // Directly take the NestJS response message
        } else if (exception.code) {
            // Handles database errors like unique constraints
            status = HttpStatus.BAD_REQUEST;
            message = exception.message || exception; // Returns the raw database error message
        }

        response.status(status).json({
            success:false,
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
        });
    }
}
