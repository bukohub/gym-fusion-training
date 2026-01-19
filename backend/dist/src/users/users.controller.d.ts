import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/constants/roles';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, role?: Role, isActive?: boolean, search?: string): Promise<{
        users: {
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
            lastLogin: Date;
            createdAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        roleDistribution: {
            clients: number;
            trainers: number;
            receptionists: number;
            admins: number;
        };
    }>;
    findOne(id: string): Promise<{
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
        emailVerified: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
        memberships: ({
            plan: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                duration: number;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            status: string;
            userId: string;
            planId: string;
        })[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: string;
            userId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            membershipId: string | null;
        }[];
        bookedClasses: ({
            class: {
                trainer: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                startTime: Date;
                endTime: Date;
                maxCapacity: number;
                trainerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            classId: string;
            bookedAt: Date;
            attended: boolean;
        })[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
        emailVerified: boolean;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        email: string;
        cedula: string;
        firstName: string;
        lastName: string;
        photo: string;
        holler: string;
        isActive: boolean;
    }>;
    activate(id: string): Promise<{
        id: string;
        email: string;
        cedula: string;
        firstName: string;
        lastName: string;
        photo: string;
        holler: string;
        isActive: boolean;
    }>;
}
