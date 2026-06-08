import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartsModule } from './parts/parts.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  // ConfigModule carrega o .env da raiz e deixa DATABASE_URL/PORT globais.
  imports: [ConfigModule.forRoot({ isGlobal: true }), PartsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
