import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from '../database/entities/feature.entity';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  providers: [FeatureService],
  controllers: [FeatureController],
  exports: [FeatureService],
})
export class FeatureModule {}
