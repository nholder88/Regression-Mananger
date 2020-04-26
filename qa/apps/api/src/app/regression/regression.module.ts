import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionHeaderController } from './header/regressionHeader.controller';
import { RegressionHeaderService } from './header/regression-header.service';
import { RegressionHeaderDto } from '../Models/regression-header.dto';
import { TestPassController } from './testPass/testPass.controller';
import { TestPassDto } from './testPass/dto/TestPass.dto';
import { TestPassService } from './testPass/testPass.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegressionHeaderDto, TestPassDto])],
  providers: [RegressionHeaderService,TestPassService],
  controllers: [RegressionHeaderController, TestPassController]
})
export class RegressionModule {}
