import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionHeader } from '../database/entities/regression-header.entity';
import { HeaderService } from './header.service';
import { HeaderController } from './header.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegressionHeader])],
  providers: [HeaderService],
  controllers: [HeaderController],
  exports: [HeaderService],
})
export class HeaderModule {}
