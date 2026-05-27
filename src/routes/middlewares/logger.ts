import crypto from 'crypto';
import { NextFunction, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Service } from 'typedi';
import { Method, RequestLogger } from '../../logger/request';
import { ICustomRequest } from '../../models/request';

@Service()
@Middleware({ type: 'before' })
export class LoggerMiddleware implements ExpressMiddlewareInterface {
  use(req: ICustomRequest, res: Response, next: NextFunction): void {
    if (req.url.includes('docs')) {
      return next();
    }

    req.requestId = crypto.randomUUID();

    const start = Date.now();

    let responseBody: unknown;

    const originalJson = res.json;
    res.json = function(body) {
      responseBody = body;
      return originalJson.call(this, body);
    };

    res.on('finish', () => {
      RequestLogger.log({
        requestId: req.requestId!,
        request: {
          method: req.method as Method,
          path: req.originalUrl,
          query: req.query,
          params: req.params,
        },
        response: {
          statusCode: res.statusCode,
          body: responseBody
        },
        duration: `${Date.now() - start}ms`
      });
    });

    next();
  }
}
