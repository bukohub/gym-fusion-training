import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
export declare class MembershipsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPlan(createMembershipPlanDto: CreateMembershipPlanDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        duration: number;
        price: number;
    }>;
    findAllPlans(page?: number, limit?: number, isActive?: boolean): Promise<{
        plans: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
                id: string;
                email: string;
                firstName: string;
                lastName: string;
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
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        duration: number;
        price: number;
    }>;
    updatePlan(id: string, updateMembershipPlanDto: UpdateMembershipPlanDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        duration: number;
        price: number;
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
    }>;
    findAllMemberships(page?: number, limit?: number, status?: string, userId?: string): Promise<{
        memberships: ({
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
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneMembership(id: string): Promise<{
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
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
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
    })[]>;
    getMembershipStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        suspended: number;
        expiringThisWeek: number;
    }>;
}
