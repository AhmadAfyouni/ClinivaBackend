import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend/backend communication
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Configure based on environment
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // Set Global API Prefix (e.g., /api/v1/)
  app.setGlobalPrefix('api/v1');

  // Error Handling
  process.on('uncaughtException', (err) => {
    Logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    Logger.error(`Unhandled Rejection: ${reason}`);
  });

  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`🚀 Server is running on http://localhost:${process.env.PORT ?? 3000}/api/v1`);
}
bootstrap();
