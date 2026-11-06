import { readFileSync } from 'node:fs';
import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () =>
        new Pool({
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 5432),
          database: process.env.DB_NAME || 'launchpad',
          user: process.env.DB_USER || 'launchpad_user',
          password: process.env.DB_PASSWORD || 'change-this-password',

          ssl:
            process.env.DB_SSL === 'true'
              ? {
                  rejectUnauthorized: true,
                  ca: readFileSync('/app/global-bundle.pem', 'utf8'),
                }
              : false,

          max: 10,
          connectionTimeoutMillis: 5000,
        }),
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
