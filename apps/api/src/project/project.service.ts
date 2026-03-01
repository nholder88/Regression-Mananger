import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectConfig } from '../database/entities/project-config.entity';
import { TestFile } from '../database/entities/test-file.entity';
import { AgentRun } from '../database/entities/agent-run.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectConfig)
    private readonly projectRepository: Repository<ProjectConfig>,
    @InjectRepository(TestFile)
    private readonly testFileRepository: Repository<TestFile>,
    @InjectRepository(AgentRun)
    private readonly agentRunRepository: Repository<AgentRun>,
  ) {}

  async findAll(
    query: PaginationDto,
    relations: string[] = [],
  ): Promise<PaginatedResponse<ProjectConfig>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.projectRepository.findAndCount({
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: string, relations: string[] = []): Promise<ProjectConfig> {
    const entity = await this.projectRepository.findOne({
      where: { id },
      relations,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async findTestFiles(
    projectId: string,
    query: PaginationDto,
  ): Promise<PaginatedResponse<TestFile>> {
    await this.findOne(projectId);
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.testFileRepository.findAndCount({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findAgentRuns(
    projectId: string,
    query: PaginationDto,
  ): Promise<PaginatedResponse<AgentRun>> {
    await this.findOne(projectId);
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.agentRunRepository.findAndCount({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async create(
    data: Partial<ProjectConfig> & { userId: string },
  ): Promise<ProjectConfig> {
    const entity = this.projectRepository.create(data);
    return this.projectRepository.save(entity);
  }

  async update(id: string, data: Partial<ProjectConfig>): Promise<ProjectConfig> {
    await this.findOne(id);
    await this.projectRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.projectRepository.delete(id);
  }
}
