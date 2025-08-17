import { Role } from '../../common/constants/roles';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
    isActive?: boolean;
}
