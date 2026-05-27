import express from 'express';
import { useExpressServer } from 'routing-controllers';
import path from 'path';

export class IndexRoutes {
  static import(app: express.Application): void {
    useExpressServer(app, {
      controllers: [ path.join(__dirname, 'controllers/**/*.{ts,js}') ],
      middlewares: [ path.join(__dirname, 'middlewares/**/*.{ts,js}') ],
      defaultErrorHandler: false,
      validation: true,
      classTransformer: true,
    })
  }
}