import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
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
      switch (exception.code) {
        case 11000: // خطأ تكرار (Duplicate Key Error)
          status = HttpStatus.BAD_REQUEST;
          message = 'Duplicate key error: ' + JSON.stringify(exception.keyValue);
          break;

        case 'ECONNREFUSED': // فشل الاتصال بقاعدة البيانات
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Database connection refused';
          break;

        case 'ETIMEDOUT': // انتهاء مهلة الاستعلام
          status = HttpStatus.REQUEST_TIMEOUT;
          message = 'Database request timed out';
          break;

        default: // أخطاء أخرى في قاعدة البيانات
          status = HttpStatus.BAD_REQUEST;
          message = exception.message || exception; // Returns the raw database error message
          break;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
