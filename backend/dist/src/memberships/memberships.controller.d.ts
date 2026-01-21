import { MembershipsService } from './memberships.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
export declare class MembershipsController {
    private readonly membershipsService;
    constructor(membershipsService: MembershipsService);
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
    create(createMembershipDto: CreateMembershipDto): Promise<{
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
    findAll(page?: number, limit?: number, status?: string, userId?: string): Promise<{
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
    getStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        suspended: number;
        expiringThisWeek: number;
    }>;
    getExpiring(days?: number): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, updateData: any): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
    renew(id: string): Promise<{
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
    suspend(id: string): Promise<{
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
    activate(id: string): Promise<{
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
    validateMembership(id: string): Promise<{
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
    validateMembershipByUser(userId: string): Promise<{
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
