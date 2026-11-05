import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { LeadsController } from './leads/leads.controller';
import { LeadsService } from './leads/leads.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController, LeadsController],
  providers: [LeadsService],
})
export class AppModule {}
