import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { Log } from './entities/logs.entity';

@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Post()
  create(@Body() dto: CreatePartDto) {
    return this.partsService.create(dto);
  }
  /* Add routes to feed front-end, and login route aswell. */
  @Post(':serialId/log')
  addLog(
    @Param('serialId') serialId: string,
    @Body() body: { step: string; operator: string },
  ) {
    return this.partsService.addLog(serialId, body);
  }

  @Get()
  findAll() {
    return this.partsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partsService.findOne(String(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartDto: UpdatePartDto) {
    return this.partsService.update(id, updatePartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partsService.remove(id);
  }
}
