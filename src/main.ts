import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());           // Apply globally
  app.setGlobalPrefix('api/v1');                              // Set Global API Prefix (e.g., /api/v1/)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 👈 هذا هو المفتاح
      whitelist: true,
    }),
  );
  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle('Clinic Management API')
    .setDescription('API documentation for the Clinic Management System')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT Authentication in Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document); // Swagger UI available at /api

  // Enable CORS for frontend/backend communication
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Configure based on environment
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });


  // Error Handling
  process.on('uncaughtException', (err) => {
    Logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    Logger.error(`Unhandled Rejection: ${reason}`);
  });

  await app.listen(process.env.PORT ?? 80);
  Logger.log(`Server is running on http://localhost:${process.env.PORT ?? 80}/api/v1`);
}

bootstrap();
