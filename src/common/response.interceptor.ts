import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      (data) => data,
      // map(data => ({
      //   success: true,
      //   statusCode: context.switchToHttp().getResponse().statusCode,
      //   message:'Request successful',
      //   timestamp: new Date().toISOString(),
      //   data: data || null
      // }))
    );
  }
}
