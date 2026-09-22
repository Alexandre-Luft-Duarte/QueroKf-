import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { type Express } from 'express';
import { AppModule } from './app.module.js';

/**
 * Configuração compartilhada pelos dois modos de execução:
 * servidor tradicional (main.ts) e função serverless na Vercel (api/[[...slug]].js).
 */
export async function createApp(expressInstance?: Express): Promise<INestApplication> {
  const app = expressInstance
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
    : await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Em produção só as origens configuradas; em dev, qualquer uma.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('QueroKafé API')
    .setDescription('API do agregador de cafés especiais: torrefações, cafés, notas sensoriais e métodos de preparo.')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  return app;
}

/**
 * Handler reaproveitado entre invocações da mesma instância serverless: o Nest só
 * inicializa uma vez, e as chamadas seguintes reutilizam a conexão já aberta com o banco.
 */
let cachedServer: Express | undefined;

export async function getServerlessHandler(): Promise<Express> {
  if (!cachedServer) {
    const expressInstance = express();
    const app = await createApp(expressInstance);
    await app.init();
    cachedServer = expressInstance;
  }

  return cachedServer;
}
