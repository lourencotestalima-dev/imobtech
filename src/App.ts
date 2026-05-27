import express from 'express';
import cors from 'cors';
import { IndexRoutes } from './routes';
import constants from './utils/constants';
import { AppDataSource } from './database';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';
import { getMetadataArgsStorage, useContainer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import swaggerUi from 'swagger-ui-express';

useContainer(Container);

export class App {
  private express: express.Application;
  private PORT: number;

  constructor() {
    this.express = express();
    this.PORT = constants.port;

    this.database();
    this.middleware();
    this.routes(this.express);
    this.documentation(this.express);
    this.listen(this.express);
  }

  private async database(): Promise<void> {
    try {
      await AppDataSource.initialize();
      Container.set(DataSource, AppDataSource);
      console.log('🌐 Conexão com o Banco de Dados estabelecida com sucesso!');
    } catch(err) {
      console.log(`Erro ao se conectar com o Banco de Dados: ${err}`)
    }
  }

  private middleware(): void {
    this.express.use(cors());
  }

  private routes(app: express.Application): void {
    IndexRoutes.import(app);
  }

  private documentation(app: express.Application): void {
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, {}, {
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      info: {
        title: 'Minha API Node.js',
        version: '1.0.0',
        description: 'Documentação automática com routing-controllers',
      },
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, {
      swaggerOptions: { tagsSorter: 'alpha' },
    }));
  }

  private listen(app: express.Application): void {
    app.listen(this.PORT, () => console.log(`Servidor rodando na porta ${this.PORT}...`));
  }
}