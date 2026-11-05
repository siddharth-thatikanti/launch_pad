import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './database/database.module';

@Controller()
export class HealthController {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'launchpad-nestjs-api' };
  }

  @Get('ready')
  async ready() {
    await this.pool.query('SELECT 1');
    return { status: 'ready', database: 'connected' };
  }
}
