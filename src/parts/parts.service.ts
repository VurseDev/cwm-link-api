import { Injectable } from '@nestjs/common';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartsService {
  private parts: any[] = [];

  create(dto: CreatePartDto) {
    const part = {
      id: Date.now(),
      ...dto,
      createdAt: new Date(),
    };

    this.parts.push(part);
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
