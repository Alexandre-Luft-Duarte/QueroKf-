import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Em produção só o domínio do frontend é liberado; em dev, qualquer origem.
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? true,
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

  const port = process.env.PORT ?? 3333;
  await app.listen(port, '0.0.0.0');
  console.log(`QueroKafé API em http://localhost:${port}/api (docs em /api/docs)`);
}

await bootstrap();
