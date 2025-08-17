import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
export declare class MembershipsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPlan(createMembershipPlanDto: CreateMembershipPlanDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        duration: number;
        price: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllPlans(page?: number, limit?: number, isActive?: boolean): Promise<{
        plans: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOnePlan(id: string): Promise<{
        memberships: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
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
    } & {
        id: string;
        name: string;
        description: string | null;
        duration: number;
        price: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePlan(id: string, updateMembershipPlanDto: UpdateMembershipPlanDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        duration: number;
        price: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removePlan(id: string): Promise<{
        message: string;
    }>;
    createMembership(createMembershipDto: CreateMembershipDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    findAllMemberships(page?: number, limit?: number, status?: string, userId?: string): Promise<{
        memberships: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            payments: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: string;
                membershipId: string | null;
                amount: number;
                method: string;
                transactionId: string | null;
            }[];
            plan: {
                id: string;
                name: string;
                description: string | null;
                duration: number;
                price: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneMembership(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        payments: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: string;
            membershipId: string | null;
            amount: number;
            method: string;
            transactionId: string | null;
        }[];
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    updateMembership(id: string, updateData: any): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    removeMembership(id: string): Promise<{
        message: string;
    }>;
    renewMembership(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    suspendMembership(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    activateMembership(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    getExpiringMemberships(days?: number): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        plan: {
            id: string;
            name: string;
            description: string | null;
            duration: number;
            price: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    })[]>;
    getMembershipStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        suspended: number;
        expiringThisWeek: number;
    }>;
    validateMembership(membershipId: string): Promise<{
        isValid: boolean;
        status: string;
        message: string;
        membership: {
            id: string;
            startDate: Date;
            endDate: Date;
            status: string;
            daysRemaining: number;
            user: {
                id: string;
                isActive: boolean;
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                photo: string;
                holler: string;
            };
            plan: {
                name: string;
                duration: number;
            };
        };
    }>;
    validateMembershipByUserId(userId: string): Promise<{
        isValid: boolean;
        status: string;
        message: string;
        membership: {
            id: string;
            startDate: Date;
            endDate: Date;
            status: string;
            daysRemaining: number;
            user: {
                id: string;
                isActive: boolean;
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                photo: string;
                holler: string;
            };
            plan: {
                name: string;
                duration: number;
            };
        };
    }>;
    validateMembershipByCedula(cedula: string): Promise<{
        isValid: boolean;
        status: string;
        message: string;
        membership: {
            id: string;
            startDate: Date;
            endDate: Date;
            status: string;
            daysRemaining: number;
            user: {
                id: string;
                isActive: boolean;
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                photo: string;
                holler: string;
            };
            plan: {
                name: string;
                duration: number;
            };
        };
    } | {
        isValid: boolean;
        status: string;
        message: string;
        membership: any;
        user: {
            firstName: string;
            lastName: string;
            cedula: string;
        };
    }>;
    validateMembershipByHoller(holler: string): Promise<{
        isValid: boolean;
        status: string;
        message: string;
        membership: {
            id: string;
            startDate: Date;
            endDate: Date;
            status: string;
            daysRemaining: number;
            user: {
                id: string;
                isActive: boolean;
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                photo: string;
                holler: string;
            };
            plan: {
                name: string;
                duration: number;
            };
        };
    } | {
        isValid: boolean;
        status: string;
        message: string;
        membership: any;
        user: {
            firstName: string;
            lastName: string;
            cedula: string;
            photo: string;
        };
    }>;
}
