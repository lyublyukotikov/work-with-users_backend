export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  static badRequest(message: string, code?: string) {
    return new ApiError(400, message, code);
  }

  static notFound(message: string, code?: string) {
    return new ApiError(404, message, code);
  }

  static internal(message: string, code?: string) {
    return new ApiError(500, message, code);
  }

  static unauthorized(message: string, code?: string) {
    return new ApiError(401, message, code);
  }

  static forbidden(message: string, code?: string) {
    return new ApiError(403, message, code);
  }
}
