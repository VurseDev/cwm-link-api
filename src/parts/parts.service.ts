import { Injectable } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PartsService {
  private parts: any[] = [];
  constructor(private prisma: PrismaService) {}
  async create(dto: CreatePartDto) {
    return this.prisma.part.create({
      data: {
        serialId: dto.serialId,
        partName: dto.partName,
        partDescription: dto.partDescription,
        status: dto.status,
        logs: {
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
    const part = await this.prisma.part.findUnique({
      where: { serialId },
    });

    if (!part) {
      return { error: 'Part not found!' };
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

  update(id: number, updatePartDto: UpdatePartDto) {
    return `This action updates a #${id} part`;
  }

  remove(id: number) {
    return `This action removes a #${id} part`;
  }
}
