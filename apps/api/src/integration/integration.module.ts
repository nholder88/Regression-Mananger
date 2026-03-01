import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationConfig } from '../database/entities/integration-config.entity';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationConfig])],
  providers: [IntegrationService],
  controllers: [IntegrationController],
  exports: [IntegrationService],
})
export class IntegrationModule {}
