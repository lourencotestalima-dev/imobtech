import { Response } from 'express';
import { AppError } from './AppError';

export class ErrorHandler {
  constructor(res: Response, err: unknown) {
    if (err instanceof AppError) {
      return res.status(err.errorCode).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
}