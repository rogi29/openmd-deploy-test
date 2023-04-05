import { NextFunction, Request, RequestHandler, Response } from 'express';

export class ProxyError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, ProxyError.prototype);
  }

  toJSON(): ProxyErrorJSON {
    return {
      statusCode: this.code,
      statusMessage: this.message,
    };
  }

  toString() {
    return `${this.code} ${this.message}`;
  }
}

export const proxyErrorHandler =
  (call: (...a: Parameters<RequestHandler>) => void | Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await call(req, res, next);
    } catch (error) {
      console.log('catch');
      const proxyError =
        error instanceof ProxyError
          ? error
          : new ProxyError(500, error.message);
      res.status(proxyError.code);
      res.statusMessage = proxyError.message;
      res.send(proxyError.toJSON());
    }
  };

interface ProxyErrorJSON {
  statusCode: number;
  statusMessage: string;
}
