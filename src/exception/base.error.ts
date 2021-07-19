import { HttpStatusCode } from '@constants/httpStatusCode';

// eslint-disable-next-line
//Information on captureStackTrace https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance
// eslint-disable-next-line
// Information on setPrototypeOf https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly description: string;

  constructor(name: string, httpCode: HttpStatusCode, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = httpCode;
    this.name = name;
    this.description = description;

    Error.captureStackTrace(this);
  }
}
