import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentRun } from '../database/entities/agent-run.entity';
import { AgentRunService } from './agent-run.service';
import { AgentRunController } from './agent-run.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentRun])],
  providers: [AgentRunService],
  controllers: [AgentRunController],
  exports: [AgentRunService],
})
export class AgentRunModule {}
