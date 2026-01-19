import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private usersService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, usersService: UsersService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            cedula: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: string;
            avatar: string;
            photo: string;
            holler: string;
            isActive: boolean;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            role: string;
            avatar: string;
            isActive: true;
        };
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    generateTokens(userId: string, email: string, role: string): Promise<{
        access_token: string;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
