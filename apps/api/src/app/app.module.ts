import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RegressionModule } from './regression/regression.module';


import { AuthModule } from './auth/auth.module';
import * as ormconfig from './ormconfig';

export function DatabaseOrmModule(): DynamicModule {
  // we could load the configuration from dotEnv here,
  // but typeORM cli would not be able to find the configuration file.

  // @ts-ignore
  return TypeOrmModule.forRoot(ormconfig);
}


@Module({
  imports: [
    // @ts-ignore
    TypeOrmModule.forRoot(ormconfig),
    RegressionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}

