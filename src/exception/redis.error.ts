import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { BaseError } from './base.error';

export class RedisError extends BaseError {
  constructor(description) {
    super(
      ErrorsMessages.INTERNAL_SERVER_ERROR,
      HttpStatusCode.INTERNAL_SERVER,
      description
    );
  }
}
