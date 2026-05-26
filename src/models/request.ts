import { Request as ExpressRequest } from 'express';

export interface ICustomRequest extends ExpressRequest {
  session?: {
    userId: string;
    sessionId: string;
    email: string;
  }
}