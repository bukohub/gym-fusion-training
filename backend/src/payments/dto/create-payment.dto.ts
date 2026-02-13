import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'membership-uuid', required: false })
  @IsOptional()
  @IsString()
  membershipId?: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'CARD', enum: ['CASH', 'CARD', 'TRANSFER'] })
  @IsString()
  method: string;

  @ApiProperty({ example: 'Monthly membership payment', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'TXN123456', required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ example: 'COMPLETED', enum: ['PENDING', 'COMPLETED', 'FAILED'], required: false })
  @IsOptional()
  @IsString()
  status?: string;
}