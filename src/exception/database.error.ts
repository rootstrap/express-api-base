import { ErrorsMessages } from '@constants/errorMessages';
import { BaseError } from './base.error';
import { HttpStatusCode } from '../constants/httpStatusCode';

export class DatabaseError extends BaseError {
  constructor(description) {
    super(
      ErrorsMessages.INTERNAL_SERVER_ERROR,
      HttpStatusCode.INTERNAL_SERVER,
      description
    );
  }
}
