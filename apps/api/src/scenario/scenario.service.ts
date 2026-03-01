import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scenario } from '../database/entities/scenario.entity';
import { Step } from '../database/entities/step.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

@Injectable()
export class ScenarioService {
  constructor(
    @InjectRepository(Scenario)
    private readonly scenarioRepository: Repository<Scenario>,
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResponse<Scenario>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.scenarioRepository.findAndCount({
      relations: ['steps', 'feature', 'user'],
      order: { order: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findOne(id: string): Promise<Scenario> {
    const entity = await this.scenarioRepository.findOne({
      where: { id },
      relations: ['steps', 'feature', 'user'],
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(data: {
    name: string;
    note?: string;
    order?: number;
    featureId: string;
    userId: string;
    steps?: { name: string; order: number }[];
  }): Promise<Scenario> {
    const { steps: stepsInput, ...scenarioData } = data;
    const scenario = this.scenarioRepository.create({
      ...scenarioData,
      order: scenarioData.order ?? 0,
      note: scenarioData.note ?? '',
    });
    const savedScenario = await this.scenarioRepository.save(scenario);

    if (stepsInput && stepsInput.length > 0) {
      const steps = stepsInput.map((s, i) =>
        this.stepRepository.create({
          name: s.name,
          order: s.order ?? i,
          scenarioId: savedScenario.id,
          userId: data.userId,
        }),
      );
      await this.stepRepository.save(steps);
    }

    return this.findOne(savedScenario.id);
  }

  async update(
    id: string,
    data: {
      name?: string;
      note?: string;
      order?: number;
      featureId?: string;
      steps?: { name: string; order: number }[];
    },
    userId: string,
  ): Promise<Scenario> {
    await this.findOne(id);

    const { steps: stepsInput, ...updateData } = data;
    if (Object.keys(updateData).length > 0) {
      await this.scenarioRepository.update(id, updateData);
    }

    if (stepsInput !== undefined) {
      await this.stepRepository.delete({ scenarioId: id });
      if (stepsInput.length > 0) {
        const steps = stepsInput.map((s, i) =>
          this.stepRepository.create({
            name: s.name,
            order: s.order ?? i,
            scenarioId: id,
            userId,
          }),
        );
        await this.stepRepository.save(steps);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.scenarioRepository.delete(id);
  }
}
