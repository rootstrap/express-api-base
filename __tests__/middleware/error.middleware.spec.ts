import { ErrorMiddleware } from 'src/middlewares/error.middleware';

describe('Error Middleware test', () => {
  it("sets errors into response object when a 400's error is thrown", () => {
    let middleware: ErrorMiddleware = new ErrorMiddleware();
  });
});
