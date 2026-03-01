import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectConfig } from '../database/entities/project-config.entity';
import { TestFile } from '../database/entities/test-file.entity';
import { AgentRun } from '../database/entities/agent-run.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectConfig, TestFile, AgentRun]),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
