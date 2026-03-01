import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScenarioResult } from '../database/entities/scenario-result.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class ScenarioResultService {
  constructor(
    @InjectRepository(ScenarioResult)
    private readonly repository: Repository<ScenarioResult>,
  ) {}

  async findAll(
    query: PaginationDto,
    filters?: { testPassId?: string; headerId?: string; featureId?: string },
  ): Promise<PaginatedResponse<ScenarioResult>> {
    const page = query.page || 1;
    const limit = query.limit || 25;

    const qb = this.repository
      .createQueryBuilder('sr')
      .leftJoinAndSelect('sr.scenario', 'scenario')
      .leftJoinAndSelect('sr.testPass', 'testPass')
      .leftJoinAndSelect('sr.user', 'user');

    if (filters?.testPassId) {
      qb.andWhere('sr.testPassId = :testPassId', { testPassId: filters.testPassId });
    }
    if (filters?.headerId) {
      qb.andWhere('testPass.headerId = :headerId', { headerId: filters.headerId });
    }
    if (filters?.featureId) {
      qb.andWhere('scenario.featureId = :featureId', { featureId: filters.featureId });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<ScenarioResult> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['scenario', 'testPass', 'user'],
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(data: Partial<ScenarioResult> & { userId: string }): Promise<ScenarioResult> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<ScenarioResult>): Promise<ScenarioResult> {
    await this.findOne(id);
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }

  async bulkUpsert(
    items: Partial<ScenarioResult>[],
    userId: string,
  ): Promise<ScenarioResult[]> {
    const results: ScenarioResult[] = [];
    for (const item of items) {
      const scenarioId = item.scenarioId;
      const testPassId = item.testPassId;
      if (!scenarioId || !testPassId) continue;

      const existing = await this.repository.findOne({
        where: { scenarioId, testPassId },
      });

      const payload = { ...item, userId };
      if (existing) {
        const { scenarioId: _sc, testPassId: _tp, ...updateData } = payload;
        await this.repository.update(existing.id, updateData);
        const updated = await this.findOne(existing.id);
        results.push(updated);
      } else {
        const created = await this.create(payload as Partial<ScenarioResult> & { userId: string });
        results.push(created);
      }
    }
    return results;
  }
}
