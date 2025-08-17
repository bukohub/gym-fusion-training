import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeMembers,
      totalClasses,
      totalProducts,
      completedPayments,
      scheduledClasses,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.membership.count({ where: { status: 'ACTIVE' } }),
      this.prisma.class.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.class.count({ where: { status: 'SCHEDULED' } }),
    ]);

    const monthlyRevenue = await this.prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amount: true },
    });

    const expiringMemberships = await this.prisma.membership.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        },
      },
    });

    const lowStockProducts = await this.prisma.product.count({
      where: {
        isActive: true,
      },
    });

    // Calculate actual low stock count
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { stock: true, minStock: true },
    });
    
    const actualLowStockCount = products.filter(p => p.stock <= p.minStock).length;

    return {
      totalUsers,
      activeMembers,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      scheduledClasses,
      expiringMemberships,
      lowStockProducts: actualLowStockCount,
      totalClasses,
      totalProducts,
      completedPayments,
    };
  }

  async getRevenueReport(startDate: string, endDate: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        membership: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const avgPayment = payments.length > 0 ? totalRevenue / payments.length : 0;

    const revenueByMethod = payments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    const dailyRevenue = payments.reduce((acc, payment) => {
      const date = payment.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      totalPayments: payments.length,
      averagePayment: Math.round(avgPayment * 100) / 100,
      revenueByMethod,
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      payments,
    };
  }

  async getMembershipReport() {
    const [memberships, plans] = await Promise.all([
      this.prisma.membership.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          plan: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.membershipPlan.findMany(),
    ]);

    const membershipsByStatus = memberships.reduce((acc, membership) => {
      acc[membership.status] = (acc[membership.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const membershipsByPlan = memberships.reduce((acc, membership) => {
      const planName = membership.plan.name;
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const expiringThisMonth = memberships.filter(membership => {
      const endDate = new Date(membership.endDate);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return endDate <= nextMonth && membership.status === 'ACTIVE';
    });

    return {
      totalMemberships: memberships.length,
      membershipsByStatus,
      membershipsByPlan,
      expiringThisMonth: expiringThisMonth.length,
      plans,
      memberships,
    };
  }

  async getClassReport(startDate?: string, endDate?: string) {
    const where: any = {};
    
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const classes = await this.prisma.class.findMany({
      where,
      include: {
        trainer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        bookings: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    const classesByStatus = classes.reduce((acc, classItem) => {
      acc[classItem.status] = (acc[classItem.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const classesByTrainer = classes.reduce((acc, classItem) => {
      const trainerName = `${classItem.trainer.firstName} ${classItem.trainer.lastName}`;
      if (!acc[trainerName]) {
        acc[trainerName] = { total: 0, bookings: 0 };
      }
      acc[trainerName].total += 1;
      acc[trainerName].bookings += classItem.bookings.length;
      return acc;
    }, {} as Record<string, { total: number; bookings: number }>);

    const totalBookings = classes.reduce((sum, classItem) => sum + classItem.bookings.length, 0);
    const totalCapacity = classes.reduce((sum, classItem) => sum + classItem.maxCapacity, 0);
    const utilizationRate = totalCapacity > 0 ? (totalBookings / totalCapacity) * 100 : 0;

    const attendanceData = await this.prisma.classBooking.groupBy({
      by: ['attended'],
      _count: true,
      where: startDate || endDate ? {
        class: {
          startTime: where.startTime,
        },
      } : undefined,
    });

    const attendedCount = attendanceData.find(data => data.attended)?._count || 0;
    const totalAttendanceRecords = attendanceData.reduce((sum, data) => sum + data._count, 0);
    const attendanceRate = totalAttendanceRecords > 0 ? (attendedCount / totalAttendanceRecords) * 100 : 0;

    return {
      totalClasses: classes.length,
      classesByStatus,
      classesByTrainer,
      totalBookings,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      classes: classes.map(classItem => ({
        ...classItem,
        currentCapacity: classItem.bookings.length,
        utilizationRate: (classItem.bookings.length / classItem.maxCapacity) * 100,
      })),
    };
  }

  async getUserReport() {
    const users = await this.prisma.user.findMany({
      include: {
        memberships: {
          include: {
            plan: true,
          },
        },
        payments: {
          where: { status: 'COMPLETED' },
        },
        bookedClasses: {
          include: {
            class: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activeUsers = users.filter(user => user.isActive).length;
    const usersWithActiveMemberships = users.filter(user => 
      user.memberships.some(membership => membership.status === 'ACTIVE')
    ).length;

    const topSpenders = users
      .map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        totalSpent: user.payments.reduce((sum, payment) => sum + payment.amount, 0),
        totalClasses: user.bookedClasses.length,
        activeMemberships: user.memberships.filter(m => m.status === 'ACTIVE').length,
      }))
      .filter(user => user.totalSpent > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      totalUsers: users.length,
      activeUsers,
      inactiveUsers: users.length - activeUsers,
      usersByRole,
      usersWithActiveMemberships,
      topSpenders,
    };
  }

  async getFinancialSummary(year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 0, 23, 59, 59);

    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const monthlyRevenue = Array(12).fill(0);
    const monthlyPayments = Array(12).fill(0);

    payments.forEach(payment => {
      const month = payment.createdAt.getMonth();
      monthlyRevenue[month] += payment.amount;
      monthlyPayments[month] += 1;
    });

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const avgMonthlyRevenue = totalRevenue / 12;

    const revenueByMethod = payments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      year,
      totalRevenue,
      totalPayments: payments.length,
      averageMonthlyRevenue: Math.round(avgMonthlyRevenue * 100) / 100,
      monthlyData: monthlyRevenue.map((revenue, index) => ({
        month: index + 1,
        revenue,
        payments: monthlyPayments[index],
      })),
      revenueByMethod,
    };
  }
}