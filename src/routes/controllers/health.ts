import { Get, JsonController } from 'routing-controllers';
import { AppDataSource } from '../../database';

@JsonController('/health')
export class HealthController {
  @Get('/')
  async check() {
    const dbConnected = AppDataSource.isInitialized;

    return {
      status: dbConnected ? 'ok' : 'degraded',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
