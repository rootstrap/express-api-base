import { DEV_ENV } from '@config';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  Middleware
} from 'routing-controllers';
import { Service } from 'typedi';

interface ErrorInterface extends Error {
  name: string;
  httpCode: number;
  description: string | undefined;
  errors: string[] | undefined;
}

@Middleware({ type: 'after' })
@Service()
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    _req: Request,
    res: Response,
    _next: (err?: any) => any
  ) {
    const responseObject = {} as ErrorInterface;

    // If the error comes from the class-validator then it's an array of ValidationError
    if (
      Array.isArray(error.errors) &&
      error.errors.every(element => element instanceof ValidationError)
    ) {
      res.status(HttpStatusCode.BAD_REQUEST);
      responseObject.httpCode = HttpStatusCode.BAD_REQUEST;
      responseObject.name = ErrorsMessages.BAD_REQUEST_ERROR;
      responseObject.description = ErrorsMessages.BODY_ERRORS;
      responseObject.errors = [];

      error.errors.forEach((element: ValidationError) => {
        const constraints = element.constraints || Object;
        Object.keys(constraints).forEach(type => {
          responseObject.errors?.push(`Property ${constraints[type]}`);
        });
      });
    } else {
      // If it's not a 400, then it will not have multiple errors.
      responseObject.errors = undefined;
      responseObject.name = error.name; // The name will apear always
      if (error.httpCode) {
        responseObject.httpCode = error.httpCode;
        res.status(error.httpCode);
      } else {
        responseObject.httpCode = HttpStatusCode.INTERNAL_SERVER;
        res.status(HttpStatusCode.INTERNAL_SERVER);
      }
      if (DEV_ENV) {
        responseObject.stack = error.stack;
      }
      if (error instanceof Error) {
        // All our errors should extends from BaseError that extends from Error
        responseObject.description = error.message;
      } else if (typeof error === 'string') {
        responseObject.description = error;
      }
      if (responseObject.description === '') {
        responseObject.description = undefined;
      }
    }
    res.json(responseObject);
  }
}
