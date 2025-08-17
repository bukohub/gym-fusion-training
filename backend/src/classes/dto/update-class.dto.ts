import { PartialType } from '@nestjs/swagger';
import { CreateClassDto } from './create-class.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @ApiProperty({ example: 'SCHEDULED', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], required: false })
  @IsOptional()
  @IsString()
  status?: string;
}