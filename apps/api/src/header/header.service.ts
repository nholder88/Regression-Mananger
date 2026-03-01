import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegressionHeader } from '../database/entities/regression-header.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(RegressionHeader)
    private readonly repository: Repository<RegressionHeader>,
  ) {}

  async findAll(
    query: PaginationDto,
    relations: string[] = ['testPasses', 'user'],
  ): Promise<PaginatedResponse<RegressionHeader>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.repository.findAndCount({
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findOne(
    id: string,
    relations: string[] = ['testPasses', 'user'],
  ): Promise<RegressionHeader> {
    const entity = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(
    data: Partial<RegressionHeader> & { userId: string },
  ): Promise<RegressionHeader> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(
    id: string,
    data: Partial<RegressionHeader>,
  ): Promise<RegressionHeader> {
    await this.findOne(id);
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
