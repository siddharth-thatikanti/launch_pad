import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(dto: CreateLeadDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();
    const message = dto.message.trim();

    const result = await this.pool.query(
      'INSERT INTO leads (name, email, message) VALUES ($1, $2, $3) RETURNING id, created_at',
      [name, email, message],
    );

    return {
      message: 'Lead created successfully.',
      lead: result.rows[0],
    };
  }
}
