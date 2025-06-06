import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import this
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// import { PermissionsGuard } from './config/permissions.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { join } from 'path'; // Import this

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Use NestExpressApplication here
  app.useGlobalFilters(new GlobalExceptionFilter()); // Apply globally
  // app.useGlobalInterceptors(new ResponseInterceptor());     // Global response transformer
  app.setGlobalPrefix('api/v1'); // Set Global API Prefix (e.g., /api/v1/)

  // Serve static files from the 'uploads' directory, accessible via /uploads URL path
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // This means URLs will be like http://localhost:PORT/uploads/clinics/logos/image.jpg
  });

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
  Logger.log(
    `Server is running on http://localhost:${process.env.PORT ?? 80}/api/v1`,
  );
}

bootstrap();
