import { Test, TestingModule } from '@nestjs/testing';
import { RegressionService } from './regression.service';
import {Repository} from "typeorm";
import {Regression} from "@qa/api-interfaces";

describe('RegressionService', () => {
  let service: RegressionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegressionService ],
    }).compile();

    const repo= new Repository<Regression>();
    service = new RegressionService(repo)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
