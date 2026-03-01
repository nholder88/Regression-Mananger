import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestFile } from '../database/entities/test-file.entity';
import { TestFileService } from './test-file.service';
import { TestFileController } from './test-file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestFile])],
  providers: [TestFileService],
  controllers: [TestFileController],
  exports: [TestFileService],
})
export class TestFileModule {}
