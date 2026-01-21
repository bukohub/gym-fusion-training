import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        membership: {
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
        };
    } & {
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
    }>;
    findAll(page?: number, limit?: number, status?: string, method?: string, userId?: string, startDate?: string, endDate?: string): Promise<{
        payments: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                id: string;
            };
            membership: {
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
            };
        } & {
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            phone: string;
            id: string;
        };
        membership: {
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
        };
        invoice: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentId: string;
            invoiceNumber: string;
            createdById: string;
            pdfPath: string | null;
        };
    } & {
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
    }>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        membership: {
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
        };
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    processPayment(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        membership: {
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
        };
    } & {
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
    }>;
    refundPayment(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        membership: {
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
        };
    } & {
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
    }>;
    failPayment(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        membership: {
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
        };
    } & {
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
    }>;
    getPaymentStats(): Promise<{
        totalPayments: number;
        completedPayments: number;
        pendingPayments: number;
        failedPayments: number;
        refundedPayments: number;
        totalRevenue: number;
        monthlyRevenue: number;
    }>;
    getRevenueByMonth(year: number): Promise<{
        month: number;
        revenue: any;
    }[]>;
}
