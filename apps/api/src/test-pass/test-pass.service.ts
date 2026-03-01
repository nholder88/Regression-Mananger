import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TestPass } from '../database/entities/test-pass.entity';
import { Feature } from '../database/entities/feature.entity';
import { Scenario } from '../database/entities/scenario.entity';
import { ScenarioResult } from '../database/entities/scenario-result.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class TestPassService {
  constructor(
    @InjectRepository(TestPass)
    private readonly testPassRepository: Repository<TestPass>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(Scenario)
    private readonly scenarioRepository: Repository<Scenario>,
    @InjectRepository(ScenarioResult)
    private readonly scenarioResultRepository: Repository<ScenarioResult>,
  ) {}

  async findAll(
    query: PaginationDto,
    relations: string[] = [],
  ): Promise<PaginatedResponse<TestPass>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.testPassRepository.findAndCount({
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: string, relations: string[] = []): Promise<TestPass> {
    const entity = await this.testPassRepository.findOne({
      where: { id },
      relations,
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async findFullExecutionTree(id: string): Promise<Record<string, unknown>> {
    const testPass = await this.testPassRepository.findOne({
      where: { id },
      relations: ['features'],
    });
    if (!testPass) throw new NotFoundException();

    const featuresData = [];
    for (const feature of testPass.features || []) {
      const scenarios = await this.scenarioRepository.find({
        where: { featureId: feature.id },
        relations: ['steps'],
        order: { order: 'ASC' },
      });
      const scenarioResults = await this.scenarioResultRepository.find({
        where: {
          testPassId: testPass.id,
          scenarioId: In(scenarios.map((s) => s.id)),
        },
      });
      const resultMap = new Map(scenarioResults.map((r) => [r.scenarioId, r]));

      const scenariosData = scenarios.map((scenario) => {
        const result = resultMap.get(scenario.id);
        return {
          id: scenario.id,
          name: scenario.name,
          note: scenario.note,
          order: scenario.order,
          steps: (scenario.steps || [])
            .sort((a, b) => a.order - b.order)
            .map((s) => ({ id: s.id, name: s.name, order: s.order })),
          result: result
            ? {
                id: result.id,
                status: result.status,
                notes: result.notes,
                completedSteps: result.completedSteps,
                bugCreated: result.bugCreated,
                bugTicketId: result.bugTicketId,
                completedBy: result.completedBy,
                timestamp: result.timestamp,
              }
            : null,
        };
      });

      featuresData.push({
        id: feature.id,
        name: feature.name,
        team: feature.team,
        scenarios: scenariosData,
      });
    }

    const { features, scenarioResults, ...testPassFields } = testPass;
    return {
      ...testPassFields,
      features: featuresData,
    };
  }

  async create(
    data: Partial<TestPass> & { userId: string; featureIds?: string[] },
  ): Promise<TestPass> {
    const { featureIds, ...rest } = data;
    const entity = this.testPassRepository.create(rest);
    if (featureIds?.length) {
      const features = await this.featureRepository.find({
        where: { id: In(featureIds) },
      });
      entity.features = features;
    }
    return this.testPassRepository.save(entity);
  }

  async update(
    id: string,
    data: Partial<TestPass> & { featureIds?: string[] },
  ): Promise<TestPass> {
    await this.findOne(id, []);
    const entity = await this.testPassRepository.findOne({
      where: { id },
      relations: ['features'],
    });
    if (!entity) throw new NotFoundException();

    const { featureIds, ...updateData } = data;
    if (featureIds !== undefined) {
      const features =
        featureIds.length > 0
          ? await this.featureRepository.find({
              where: { id: In(featureIds) },
            })
          : [];
      entity.features = features;
    }
    Object.assign(entity, updateData);
    return this.testPassRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.testPassRepository.delete(id);
  }
}
