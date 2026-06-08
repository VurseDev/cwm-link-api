import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que o Vite consuma a API local durante o desenvolvimento.
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Garante validacao dos DTOs antes de chegar nos services.
  app.useGlobalPipes(new ValidationPipe());

  // Por padrao a API roda na porta 3001 para nao conflitar com o auth service.
  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`🚀 NestJS API running at http://localhost:${port}`);
}
bootstrap();
