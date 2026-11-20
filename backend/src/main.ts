import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Logger } from '@nestjs/common';
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
    // trim + sans "/" final : un espace ou retour à la ligne collé dans Render
    // rendrait l'en-tête CORS invalide et ferait échouer toutes les requêtes
    origin: configService.getOrThrow<string>('FRONTEND_URL').trim().replace(/\/+$/, ''),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // Limitation de la taille du payload
  app.useBodyParser('json', { limit: '1mb' });

  // Validation : ZodValidationPipe sur chaque route. Pas de ValidationPipe global,
  // qui exigerait class-validator (absent du projet) et ferait planter le démarrage.
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Réglo API')
    .setDescription('Freelance management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, { useGlobalPrefix: true });

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  logger.log(`🚀 Réglo API démarrée sur http://localhost:${port}/api`);
  logger.log(`📚 Documentation Swagger sur http://localhost:${port}/api/docs`);
}

void bootstrap();
