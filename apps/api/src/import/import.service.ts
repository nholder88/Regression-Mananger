import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportSession } from '../database/entities/import-session.entity';
import { IntegrationConfig } from '../database/entities/integration-config.entity';
import { Feature } from '../database/entities/feature.entity';
import { Scenario } from '../database/entities/scenario.entity';
import { Step } from '../database/entities/step.entity';
import { PaginationDto, PaginatedResponse, paginate } from '../common/pagination.dto';

export interface ImportMapping {
  externalId: string;
  importAs: string;
  targetFeatureId?: string;
  newFeatureName?: string;
  autoGenerateSteps?: boolean;
}

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(ImportSession)
    private readonly importSessionRepository: Repository<ImportSession>,
    @InjectRepository(IntegrationConfig)
    private readonly integrationRepository: Repository<IntegrationConfig>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(Scenario)
    private readonly scenarioRepository: Repository<Scenario>,
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
  ) {}

  async preview(
    integrationId: string,
    _query: string,
  ): Promise<{ issues: unknown[] }> {
    await this.integrationRepository.findOneOrFail({ where: { id: integrationId } });
    return { issues: [] };
  }

  async execute(
    integrationId: string,
    mappings: ImportMapping[],
    userId: string,
  ): Promise<ImportSession> {
    await this.integrationRepository.findOneOrFail({ where: { id: integrationId } });
    const session = this.importSessionRepository.create({
      integrationId,
      query: '',
      status: 'completed',
      importedCount: 0,
      skippedCount: 0,
      userId,
    });
    const saved = await this.importSessionRepository.save(session);
    let importedCount = 0;
    let skippedCount = 0;

    for (const mapping of mappings) {
      try {
        if (mapping.importAs === 'feature' && mapping.newFeatureName) {
          const feature = this.featureRepository.create({
            name: mapping.newFeatureName,
            team: '',
            userId,
          });
          await this.featureRepository.save(feature);
          importedCount++;
        } else if (
          mapping.importAs === 'scenario' &&
          mapping.targetFeatureId
        ) {
          const feature = await this.featureRepository.findOne({
            where: { id: mapping.targetFeatureId },
          });
          if (!feature) {
            skippedCount++;
            continue;
          }
          const scenario = this.scenarioRepository.create({
            name: `Imported: ${mapping.externalId}`,
            featureId: mapping.targetFeatureId,
            userId,
          });
          const savedScenario = await this.scenarioRepository.save(scenario);
          if (mapping.autoGenerateSteps) {
            const step = this.stepRepository.create({
              name: 'Step 1',
              order: 0,
              scenarioId: savedScenario.id,
              userId,
            });
            await this.stepRepository.save(step);
          }
          importedCount++;
        } else {
          skippedCount++;
        }
      } catch {
        skippedCount++;
      }
    }

    await this.importSessionRepository.update(saved.id, {
      importedCount,
      skippedCount,
    });
    return this.importSessionRepository.findOneOrFail({
      where: { id: saved.id },
    });
  }

  async findAllSessions(
    query: PaginationDto,
  ): Promise<PaginatedResponse<ImportSession>> {
    const page = query.page || 1;
    const limit = query.limit || 25;
    const [data, total] = await this.importSessionRepository.findAndCount({
      relations: ['integration'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(data, total, page, limit);
  }

  async findSessionById(id: string): Promise<ImportSession> {
    const entity = await this.importSessionRepository.findOne({
      where: { id },
      relations: ['integration'],
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async undoSession(id: string): Promise<ImportSession> {
    const entity = await this.findSessionById(id);
    await this.importSessionRepository.update(id, { status: 'undone' });
    return this.importSessionRepository.findOneOrFail({
      where: { id },
      relations: ['integration'],
    });
  }
}
