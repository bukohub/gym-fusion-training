import { IsString, IsOptional, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Morning Yoga' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Relaxing yoga class for all levels', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'trainer-uuid' })
  @IsString()
  trainerId: string;

  @ApiProperty({ example: '2024-01-15T09:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  maxCapacity: number;
}