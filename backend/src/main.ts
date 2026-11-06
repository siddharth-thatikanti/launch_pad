import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // CORS configuration for multi-cloud deployment
  const corsOrigins = (
    process.env.CORS_ORIGIN ||
    [
      'http://localhost:3000',
      'https://www.whitestoneproperties.in',
      'https://launchpad-frontend-h0h8c2ebarcafucu.centralindia-01.azurewebsites.net',
      'https://la-f2ae1b2fcaf446ad9639574bb7a22eec.ecs.ap-southeast-2.on.aws',
    ].join(',')
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Azure App Service and AWS ECS compatible port
  const port = Number(process.env.PORT || 4000);

  await app.listen(port, '0.0.0.0');

  console.log(`LaunchPad API running on port ${port}`);
  console.log('Allowed CORS origins:', corsOrigins);
}

bootstrap();
