import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestFile } from '../database/entities/test-file.entity';

@Injectable()
export class TestFileService {
  constructor(
    @InjectRepository(TestFile)
    private readonly repository: Repository<TestFile>,
  ) {}

  async findOne(id: string): Promise<TestFile> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async create(data: Partial<TestFile>): Promise<TestFile> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<TestFile>): Promise<TestFile> {
    await this.findOne(id);
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }

  async bulkCreate(items: Partial<TestFile>[]): Promise<TestFile[]> {
    const entities = items.map((item) => this.repository.create(item));
    return this.repository.save(entities);
  }
}
