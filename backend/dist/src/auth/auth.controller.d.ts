import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
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
    getProfile(user: any): Promise<{
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    refresh(user: any): Promise<{
        access_token: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
}
