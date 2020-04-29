import { Test, TestingModule } from '@nestjs/testing';
import { RegressionHeaderController } from './regressionHeader.controller';

describe('Regression Header Controller', () => {
  let controller: RegressionHeaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegressionHeaderController]
    }).compile();

    controller = module.get<RegressionHeaderController>(RegressionHeaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
