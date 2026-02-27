import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env['API_PORT'] || 3333;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
}
bootstrap();
