import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
export declare class MembershipsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPlan(createMembershipPlanDto: CreateMembershipPlanDto): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        price: number;
    }>;
    findAllPlans(page?: number, limit?: number, isActive?: boolean): Promise<{
        plans: {
            name: string;
            description: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            duration: number;
            price: number;
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
                email: string;
                firstName: string;
                lastName: string;
                id: string;
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
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        price: number;
    }>;
    updatePlan(id: string, updateMembershipPlanDto: UpdateMembershipPlanDto): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        price: number;
    }>;
    removePlan(id: string): Promise<{
        message: string;
    }>;
    createMembership(createMembershipDto: CreateMembershipDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
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
    }>;
    findAllMemberships(page?: number, limit?: number, status?: string, userId?: string): Promise<{
        memberships: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                id: string;
            };
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneMembership(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            id: string;
        };
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
    }>;
    updateMembership(id: string, updateData: any): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
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
    }>;
    removeMembership(id: string): Promise<{
        message: string;
    }>;
    renewMembership(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
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
    }>;
    suspendMembership(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
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
    }>;
    activateMembership(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
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
    }>;
    getExpiringMemberships(days?: number): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            id: string;
        };
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
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                isActive: boolean;
                photo: string;
                holler: string;
                id: string;
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
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                isActive: boolean;
                photo: string;
                holler: string;
                id: string;
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
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                isActive: boolean;
                photo: string;
                holler: string;
                id: string;
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
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                isActive: boolean;
                photo: string;
                holler: string;
                id: string;
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
