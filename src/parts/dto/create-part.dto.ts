import { IsString } from 'class-validator';

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

}
