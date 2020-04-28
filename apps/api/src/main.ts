/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 4 * 60 * 1000, // 4 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    })
  );

  const options = new DocumentBuilder()
    .setTitle('Regression Nestjs API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('qa')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3333;

  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
