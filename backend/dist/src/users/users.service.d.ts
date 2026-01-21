import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/constants/roles';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        cedula: string;
        phone: string;
        role: string;
        isActive: boolean;
        photo: string;
        holler: string;
        id: string;
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(page?: number, limit?: number, role?: Role, isActive?: boolean, search?: string): Promise<{
        users: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            phone: string;
            role: string;
            isActive: boolean;
            photo: string;
            holler: string;
            id: string;
            avatar: string;
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
    findOne(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        cedula: string;
        phone: string;
        role: string;
        isActive: boolean;
        photo: string;
        holler: string;
        id: string;
        avatar: string;
        emailVerified: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
        memberships: ({
            plan: {
                name: string;
                description: string | null;
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                duration: number;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
            startDate: Date;
            endDate: Date;
            status: string;
        })[];
        payments: {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            membershipId: string | null;
            amount: number;
            method: string;
            transactionId: string | null;
        }[];
        bookedClasses: ({
            class: {
                trainer: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                trainerId: string;
                startTime: Date;
                endTime: Date;
                maxCapacity: number;
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
        email: string;
        firstName: string;
        lastName: string;
        cedula: string;
        phone: string;
        role: string;
        isActive: boolean;
        photo: string;
        holler: string;
        id: string;
        avatar: string;
        emailVerified: boolean;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    deactivate(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        cedula: string;
        isActive: boolean;
        photo: string;
        holler: string;
        id: string;
    }>;
    activate(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        cedula: string;
        isActive: boolean;
        photo: string;
        holler: string;
        id: string;
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
}
