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
import rateLimit from 'express-rate-limit';

useContainer(Container);

const authRateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Muitas tentativas. Tente novamente em instantes.' },
});

export class App {
  private express: express.Application;
  private PORT: number;

  private constructor() {
    this.express = express();
    this.PORT = constants.port;
  }

  static async create(): Promise<App> {
    const app = new App();
    await app.database();
    app.middleware();
    app.routes(app.express);
    app.documentation(app.express);
    app.listen(app.express);
    return app;
  }

  private async database(retries = 5, delayMs = 3000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();
        Container.set(DataSource, AppDataSource);
        console.log('🌐 Conexão com o Banco de Dados estabelecida com sucesso!');
        return;
      } catch (err) {
        console.log(`[${attempt}/${retries}] Erro ao conectar ao Banco de Dados: ${err}`);
        if (attempt === retries) {
          console.log('Número máximo de tentativas atingido. Encerrando...');
          process.exit(1);
        }
        console.log(`Aguardando ${delayMs / 1000}s antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use('/auth', authRateLimiter);
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
        title: 'ImobTech API',
        version: '1.0.0',
        description: 'API de cadastro de clientes para o setor imobiliário',
      },
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, {
      swaggerOptions: { tagsSorter: 'alpha', persistAuthorization: true },
    }));
  }

  private listen(app: express.Application): void {
    app.listen(this.PORT, () => console.log(`Servidor rodando na porta ${this.PORT}...`));
  }
}
