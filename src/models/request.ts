import { Request as ExpressRequest } from 'express';

export interface ICustomRequest extends ExpressRequest {
  requestId?: string;
  session?: {
    userId: string;
    sessionId: string;
    email: string;
  };
}