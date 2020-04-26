import { Test, TestingModule } from '@nestjs/testing';
import { RegressionHeaderService } from './regression-header.service';
import { Repository } from 'typeorm';
import { RegressionHeaderDto } from '../../Models/regression-header.dto';

describe('RegressionService', () => {
  let service: RegressionHeaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegressionHeaderService]
    }).compile();

    const repo = new Repository<RegressionHeaderDto>();
    service = new RegressionHeaderService(repo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
