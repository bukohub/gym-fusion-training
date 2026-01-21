import { PrismaService } from '../common/prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        activeMembers: number;
        monthlyRevenue: number;
        scheduledClasses: number;
        expiringMemberships: number;
        lowStockProducts: number;
        totalClasses: number;
        totalProducts: number;
        completedPayments: number;
    }>;
    getRevenueReport(startDate: string, endDate: string): Promise<{
        totalRevenue: number;
        totalPayments: number;
        averagePayment: number;
        revenueByMethod: Record<string, number>;
        dailyRevenue: {
            date: string;
            revenue: number;
        }[];
        payments: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
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
    }>;
    getMembershipReport(): Promise<{
        totalMemberships: number;
        membershipsByStatus: Record<string, number>;
        membershipsByPlan: Record<string, number>;
        expiringThisMonth: number;
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
        memberships: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
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
        })[];
    }>;
    getClassReport(startDate?: string, endDate?: string): Promise<{
        totalClasses: number;
        classesByStatus: Record<string, number>;
        classesByTrainer: Record<string, {
            total: number;
            bookings: number;
        }>;
        totalBookings: number;
        utilizationRate: number;
        attendanceRate: number;
        classes: {
            currentCapacity: number;
            utilizationRate: number;
            trainer: {
                email: string;
                firstName: string;
                lastName: string;
            };
            bookings: ({
                user: {
                    firstName: string;
                    lastName: string;
                    cedula: string;
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
        }[];
    }>;
    getUserReport(): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        usersByRole: Record<string, number>;
        usersWithActiveMemberships: number;
        topSpenders: {
            id: string;
            name: string;
            email: string;
            totalSpent: number;
            totalClasses: number;
            activeMemberships: number;
        }[];
    }>;
    getFinancialSummary(year: number): Promise<{
        year: number;
        totalRevenue: number;
        totalPayments: number;
        averageMonthlyRevenue: number;
        monthlyData: {
            month: number;
            revenue: any;
            payments: any;
        }[];
        revenueByMethod: Record<string, number>;
    }>;
}
