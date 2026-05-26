import path from 'path';
import { createLogger } from '.';
import { IncomingHttpHeaders } from 'http';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface Request {
  method: Method;
  path: string;
  query: ParsedQs;
  params: ParamsDictionary;
}

export interface Response {
  statusCode: number;
  body: unknown;
}

export class RequestLogger {
  static async log(data: { request: Request, response: Response, duration: string }) {
    const requestLogger = createLogger(path.resolve(__dirname, '../../logs/requests.json'));
    requestLogger.info(data);
  }
}