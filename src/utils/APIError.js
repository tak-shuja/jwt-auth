export class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "APIError";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
