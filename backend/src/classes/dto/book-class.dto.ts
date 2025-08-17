import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookClassDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'class-uuid' })
  @IsString()
  classId: string;
}