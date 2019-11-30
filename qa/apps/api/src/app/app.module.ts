import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mongodb',
    host: 'ds139037.mlab.com',
    port: 39037,
    username: 'admin',
    password: 'admin1',
    database: 'regression',
    entities: [],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
