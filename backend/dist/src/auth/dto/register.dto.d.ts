import { Role } from '../../common/constants/roles';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    cedula: string;
    phone?: string;
    role?: Role;
    photo?: string;
    holler?: string;
}
