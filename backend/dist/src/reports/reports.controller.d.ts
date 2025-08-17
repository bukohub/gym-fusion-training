import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
                cedula: string;
                firstName: string;
                lastName: string;
            };
            membership: {
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
            };
        } & {
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
        })[];
    }>;
    getMembershipReport(): Promise<{
        totalMemberships: number;
        membershipsByStatus: Record<string, number>;
        membershipsByPlan: Record<string, number>;
        expiringThisMonth: number;
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
        memberships: ({
            user: {
                email: string;
                cedula: string;
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
                    cedula: string;
                    firstName: string;
                    lastName: string;
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
