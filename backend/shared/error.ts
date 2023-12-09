type AppErrorConfig {
  cause?: Error
  code?: string
  httpCode?: number
  details?: string
}

export default class AppError extends Error {
  code: string | number;
  httpCode?: string | number;
  details?: string;
  timestamp: string;
  cause?: Error;
  constructor(message: string, config?: AppErrorConfig) {
    super(message);
    this.cause = config?.cause;
    this.code = config?.code || 'INTERNAL_ERROR';
    this.httpCode = config?.httpCode || 400
    this.details = config?.details || '';
    this.timestamp = new Date().toString();
  }
  toObject() {
    return {
      code: this?.code,
      message: this?.message,
      cause: this?.cause,
      stack: this?.stack,
    };
  }
}

