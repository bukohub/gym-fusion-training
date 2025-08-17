import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Protein Powder' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'High-quality whey protein powder', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 39.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  minStock: number;

  @ApiProperty({ example: 'Supplements' })
  @IsString()
  category: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}