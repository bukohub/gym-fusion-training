import { IsEmail, IsString, IsOptional, IsEnum, MinLength, IsBoolean, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/constants/roles';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

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
  @MinLength(6, { message: 'password must be longer than or equal to 6 characters' })
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  cedula: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  @IsString()
  role: Role;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '/uploads/photos/user.jpg', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 'HOLLER12345', required: false })
  @IsOptional()
  @IsString()
  holler?: string;
}