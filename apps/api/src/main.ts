import { createApp } from './app.factory.js';

/** Execução local e em qualquer host que rode um servidor Node tradicional. */
async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? 3333;

  await app.listen(port, '0.0.0.0');
  console.log(`QueroKafé API em http://localhost:${port}/api (docs em /api/docs)`);
}

await bootstrap();
