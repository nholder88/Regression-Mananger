import { Test, TestingModule } from '@nestjs/testing';
import { RegressionService } from './regression.service';
import { Repository } from 'typeorm';
import { RegressionEntity } from '../Models/orm-entities';

describe('RegressionService', () => {
  let service: RegressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegressionService]
    }).compile();

    const repo = new Repository<RegressionEntity>();
    service = new RegressionService(repo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
