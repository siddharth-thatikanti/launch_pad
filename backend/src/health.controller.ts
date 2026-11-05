import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Pool } from 'pg';
import { PG_POOL } from './database/database.module';

@Controller()
export class HealthController {
  constructor(
    @Inject(PG_POOL)
    private readonly pool: Pool,
  ) {}

  // Basic application health check
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'launchpad-nestjs-api',
      timestamp: new Date().toISOString(),
    };
  }

  // Database readiness check
  @Get('ready')
  async ready() {
    try {
      await this.pool.query('SELECT 1');

      return {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(
        'Database readiness check failed:',
        error instanceof Error ? error.message : 'Unknown error',
      );

      throw new ServiceUnavailableException({
        status: 'not_ready',
        database: 'disconnected',
        message: 'PostgreSQL connection failed',
      });
    }
  }
}
