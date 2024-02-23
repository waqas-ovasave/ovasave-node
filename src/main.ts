import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set a global prefix for all routes in the application
  app.setGlobalPrefix('v1');
  await app.listen(3000);
}
bootstrap();
