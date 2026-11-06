import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Un seul proxy devant l'API (Render) : req.ip devient l'IP réelle du client
  app.set('trust proxy', 1);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // Limitation de la taille du payload
  app.useBodyParser('json', { limit: '1mb' });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FreelanceHub API')
    .setDescription('Freelance management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, { useGlobalPrefix: true });

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  logger.log(`🚀 FreelanceHub API démarrée sur http://localhost:${port}/api`);
  logger.log(`📚 Documentation Swagger sur http://localhost:${port}/api/docs`);
}

void bootstrap();
