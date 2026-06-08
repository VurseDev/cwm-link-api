import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePartDto) {
    return this.prisma.part.create({
      data: {
        serialId: dto.serialId,
        partName: dto.partName,
        partDescription: dto.partDescription,
        status: dto.status,
        logs: {
          // Toda peca nasce com um log inicial para manter rastreabilidade.
          create: {
            step: 'created',
            operator: dto.operator,
          },
        },
      },
      include: { logs: true },
    });
  }

  async addLog(serialId: string, body: { step: string; operator: string }) {
    // O front e as rotas usam serialId como identificador publico da peca.
    const part = await this.prisma.part.findUnique({
      where: { serialId },
    });

    if (!part) {
      throw new NotFoundException(`Part with serialId ${serialId} not found`);
    }

    return this.prisma.log.create({
      data: {
        step: body.step,
        operator: body.operator,
        partId: part.id,
      },
    });
  }

  async findAll() {
    return this.prisma.part.findMany({
      include: { logs: true },
    });
  }

  async findOne(serialId: string) {
    return this.prisma.part.findUnique({
      where: { serialId },
      include: { logs: true },
    });
  }

  async update(serialId: string, updatePartDto: UpdatePartDto) {
    try {
      return await this.prisma.part.update({
        where: { serialId },
        data: {
          partName: updatePartDto.partName,
          partDescription: updatePartDto.partDescription,
          status: updatePartDto.status,
        },
        include: { logs: true },
      });
    } catch (error) {
      // P2025 e o codigo do Prisma para registro inexistente em update/delete.
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Part with serialId ${serialId} not found`);
        }
      }
      throw error;
    }
  }

  async remove(serialId: string) {
    try {
      return await this.prisma.part.delete({
        where: { serialId },
        include: { logs: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Part with serialId ${serialId} not found`);
        }
      }
      throw error;
    }
  }
}
