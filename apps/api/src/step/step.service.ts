import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Step } from '../database/entities/step.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class StepService {
  constructor(
    @InjectRepository(Step)
    private readonly repository: Repository<Step>,
  ) {}

  async findAll(query: PaginationDto, relations: string[] = []): Promise<PaginatedResponse<Step>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.repository.findAndCount({
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: string, relations: string[] = []): Promise<Step> {
    const entity = await this.repository.findOne({ where: { id }, relations });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(data: Partial<Step>): Promise<Step> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Step>): Promise<Step> {
    await this.findOne(id);
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
