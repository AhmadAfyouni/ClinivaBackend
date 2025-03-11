import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Swagger
  const config = new DocumentBuilder()
      .setTitle('Clinic Management API')
      .setDescription('API documentation for the Clinic Management System')
      .setVersion('1.0')
      .addBearerAuth() // Enable JWT Authentication in Swagger
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI available at /api

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
