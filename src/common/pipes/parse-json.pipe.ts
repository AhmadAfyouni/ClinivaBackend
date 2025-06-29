import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string') {
      // This case might not be hit if the form data is always a string, but it's good practice.
      throw new BadRequestException(
        'Validation failed (expected a stringified JSON).',
      );

    }
    try {
      // Parse the string into a JavaScript object
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed (invalid JSON string).');
    }
  }

}
