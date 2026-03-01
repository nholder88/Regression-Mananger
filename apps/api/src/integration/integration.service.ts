import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationConfig } from '../database/entities/integration-config.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

function excludeAuthToken<T extends { authToken?: string }>(
  entity: T,
): Omit<T, 'authToken'> {
  const { authToken, ...rest } = entity;
  return rest as Omit<T, 'authToken'>;
}

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(IntegrationConfig)
    private readonly repository: Repository<IntegrationConfig>,
  ) {}

  async findAll(
    query: PaginationDto,
  ): Promise<PaginatedResponse<Omit<IntegrationConfig, 'authToken'>>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const sanitized = data.map(excludeAuthToken);
    return paginate(sanitized, total, page, limit);
  }

  async findOne(id: string): Promise<Omit<IntegrationConfig, 'authToken'>> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    return excludeAuthToken(entity);
  }

  async create(
    data: Partial<IntegrationConfig> & { userId: string },
  ): Promise<Omit<IntegrationConfig, 'authToken'>> {
    const entity = this.repository.create({
      ...data,
      authToken: data.authToken ?? '',
    });
    const saved = await this.repository.save(entity);
    return excludeAuthToken(saved);
  }

  async update(
    id: string,
    data: Partial<IntegrationConfig>,
  ): Promise<Omit<IntegrationConfig, 'authToken'>> {
    await this.repository.findOneOrFail({ where: { id } });
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException();
    return excludeAuthToken(updated) as Omit<IntegrationConfig, 'authToken'>;
  }

  async remove(id: string): Promise<void> {
    await this.repository.findOneOrFail({ where: { id } });
    await this.repository.delete(id);
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string }> {
    await this.repository.findOneOrFail({ where: { id } });
    return { success: true, message: 'Connection test placeholder' };
  }
}
