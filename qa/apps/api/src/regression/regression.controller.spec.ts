import { Test, TestingModule } from '@nestjs/testing';
import { RegressionController } from './regression.controller';

describe('Regression Controller', () => {
  let controller: RegressionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegressionController],
    }).compile();

    controller = module.get<RegressionController>(RegressionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
