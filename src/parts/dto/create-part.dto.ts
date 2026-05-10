import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class CreatePartDto {
  @IsString()
  serialId: string;

  @IsString()
  operator: string;

  @IsString()
  partName: string;

  @IsString()
  partDescription: string;

  @IsString()
  status: string;

  @IsArray()
  part: string[];
  /* TODO: Add the rest of classes for other api endpoints */
  @IsArray()
  logs: string[];
}
