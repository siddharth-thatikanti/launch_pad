
import { readFileSync, existsSync } from 'node:fs';
import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => {
        const sslEnabled = process.env.DB_SSL === 'true';

        const caPath =
          process.env.DB_SSL_CA_PATH ||
          (existsSync('/app/global-bundle.pem')
            ? '/app/global-bundle.pem'
            : undefined);

        const caFromEnv = process.env.DB_SSL_CA
          ?.replace(/\\n/g, '\n');

        const ssl = !sslEnabled
          ? false
          : {
              rejectUnauthorized: true,
              ...(caFromEnv
                ? { ca: caFromEnv }
                : caPath
                  ? { ca: readFileSync(caPath, 'utf8') }
                  : {}),
            };

        return new Pool({
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 5432),
          database: process.env.DB_NAME || 'launchpad',
          user: process.env.DB_USER || 'launchpad',
          password: process.env.DB_PASSWORD,
          ssl,
          max: 10,
          connectionTimeoutMillis: 5000,
        });
      },
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}

