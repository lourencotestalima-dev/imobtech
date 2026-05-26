import express from 'express';
import { useExpressServer } from 'routing-controllers';
import path from 'path';

export class IndexRoutes {
  static import(app: express.Application): void {
    useExpressServer(app, {
      controllers: [ path.join(__dirname, 'controllers/**/*.ts') ],
      middlewares: [ path.join(__dirname, 'middlewares/**/*.ts') ],
      defaultErrorHandler: false,
      validation: true,
      classTransformer: true,
    })
  }
}