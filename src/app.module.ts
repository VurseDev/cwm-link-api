import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartsModule } from './parts/parts.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PartsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
