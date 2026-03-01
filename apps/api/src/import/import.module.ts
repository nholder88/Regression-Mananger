import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportSession } from '../database/entities/import-session.entity';
import { IntegrationConfig } from '../database/entities/integration-config.entity';
import { Feature } from '../database/entities/feature.entity';
import { Scenario } from '../database/entities/scenario.entity';
import { Step } from '../database/entities/step.entity';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImportSession,
      IntegrationConfig,
      Feature,
      Scenario,
      Step,
    ]),
  ],
  providers: [ImportService],
  controllers: [ImportController],
  exports: [ImportService],
})
export class ImportModule {}
