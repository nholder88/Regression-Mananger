import { Test, TestingModule } from '@nestjs/testing';
import { RegressionService } from './regression.service';

describe('RegressionService', () => {
  let service: RegressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegressionService],
    }).compile();

    service = module.get<RegressionService>(RegressionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
