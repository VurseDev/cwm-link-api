import { Injectable } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartsService {
  private parts: any[] = [];

  create(dto: CreatePartDto) {
    const part = {
      id: Date.now(),
      serialId: dto.serialId,
      partName: dto.partName,
      partDescription: dto.partDescription,
      status: dto.status,
      createdAt: new Date(),
      logs: [
        {
          step: 'created',
          operator: dto.operator,
          timestamp: new Date(),
        },
      ],
    };

    this.parts.push(part);
    return part;
  }

  addLog(serialId: string, body: { step: string; operator: string }) {
    const part = this.parts.find((p) => p.serialId === serialId);

    if (!part) {
      return { Error: 'Part not found!' };
    }

    const log = {
      step: body.step,
      operator: body.operator,
      timestamp: new Date(),
    };

    part.logs.push(log);

    return part;
  }

  findAll() {
    return this.parts;
  }

  findOne(id: number) {
    return this.parts.find((p) => p.id === id);
  }

  update(id: number, updatePartDto: UpdatePartDto) {
    return `This action updates a #${id} part`;
  }

  remove(id: number) {
    return `This action removes a #${id} part`;
  }
}
