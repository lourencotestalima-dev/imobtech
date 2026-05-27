import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { AppDataSource } from '../../database';
import { DateTime } from 'luxon';

@Service()
@JsonController('/health')
export class HealthController {
  @Get('/')
  async check() {
    const dbConnected = AppDataSource.isInitialized;

    return {
      status: dbConnected ? 'ok' : 'degraded',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: DateTime.fromJSDate(new Date()).setZone('America/Sao_Paulo').toISO()
    };
  }
}
