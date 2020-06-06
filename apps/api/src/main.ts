import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app/app.module';
//import { CrudConfigService } from '@nestjsx/crud';

/*
//this Config is not being loaded for some reason. See This for more information
//:https://github.com/nestjsx/crud/blob/master/integration/crud-typeorm/main.ts
CrudConfigService.load({
  auth: {
    property: 'user'
  },
  params: {
    id: { field: 'id', type: 'string', primary: true }
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase']
  },
  query: {
    maxLimit: 100
  }
});*/
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
