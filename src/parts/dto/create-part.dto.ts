import { IsString, IsArray, IsOptional, IsInt } from 'class-validator';

export class CreatePartDto {
  @IsInt()
  serialId: number;

  @IsString()
  partName: string;

  @IsString()
  partDescription: string;

  @IsString()
  status: string;

  @IsArray()
  part: string[];

  @IsArray()
  @IsOptional()
  steps?: string[];
}
