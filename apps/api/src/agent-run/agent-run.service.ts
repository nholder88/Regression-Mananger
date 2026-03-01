import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentRun } from '../database/entities/agent-run.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class AgentRunService {
  constructor(
    @InjectRepository(AgentRun)
    private readonly repository: Repository<AgentRun>,
  ) {}

  async findAll(
    query: PaginationDto,
    projectId?: string,
  ): Promise<PaginatedResponse<AgentRun>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const where = projectId ? { projectId } : {};
    const [data, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<AgentRun> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(
    data: Partial<AgentRun> & { userId: string },
  ): Promise<AgentRun> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<AgentRun>): Promise<AgentRun> {
    await this.findOne(id);
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
