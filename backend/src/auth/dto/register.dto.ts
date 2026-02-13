import { IsEmail, IsString, IsOptional, IsEnum, MinLength, IsPhoneNumber, ValidateIf, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/constants/roles';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsOptional()
  @ValidateIf((_, value) => value !== '' && value != null)
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password123', minLength: 6, required: false })
  @IsOptional()
  @ValidateIf((object, value) => {
    // Skip validation if role is CLIENT and password is empty/undefined
    if (object.role === Role.CLIENT && (!value || value === '')) {
      return false;
    }
    // Apply validation for all other cases
    return true;
  })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  @IsString()
  cedula?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    enum: Role, 
    example: Role.CLIENT, 
    required: false,
    description: 'User role - defaults to CLIENT'
  })
  @IsOptional()
  @IsString()
  role?: Role;

  @ApiProperty({ example: '/uploads/photos/user.jpg', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 'HOLLER12345', required: false })
  @IsOptional()
  @IsString()
  holler?: string;

  @ApiProperty({ example: 70.5, required: false })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ example: 175, required: false })
  @IsOptional()
  @IsNumber()
  height?: number;
}