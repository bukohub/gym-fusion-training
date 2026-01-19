import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ValidationLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 10,
    validationType?: string,
    success?: boolean,
    startDate?: string,
    endDate?: string,
    userId?: string
  ) {
    const offset = (page - 1) * limit;
    
    const where: any = {};
    
    if (validationType) {
      where.validationType = validationType;
    }
    
    if (typeof success === 'boolean') {
      where.success = success;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate || endDate) {
      where.validatedAt = {};
      if (startDate) {
        where.validatedAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999); // End of day
        where.validatedAt.lte = endDateTime;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.validationLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              cedula: true,
              photo: true,
            },
          },
        },
        orderBy: { validatedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.validationLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [
      totalValidations,
      successfulValidations,
      failedValidations,
      cedulaValidations,
      hollerValidations,
    ] = await Promise.all([
      this.prisma.validationLog.count(),
      this.prisma.validationLog.count({ where: { success: true } }),
      this.prisma.validationLog.count({ where: { success: false } }),
      this.prisma.validationLog.count({ where: { validationType: 'CEDULA' } }),
      this.prisma.validationLog.count({ where: { validationType: 'HOLLER' } }),
    ]);

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      todayTotal,
      todaySuccessful,
      todayFailed,
    ] = await Promise.all([
      this.prisma.validationLog.count({
        where: {
          validatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      this.prisma.validationLog.count({
        where: {
          success: true,
          validatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      this.prisma.validationLog.count({
        where: {
          success: false,
          validatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    return {
      total: {
        all: totalValidations,
        successful: successfulValidations,
        failed: failedValidations,
        cedula: cedulaValidations,
        holler: hollerValidations,
      },
      today: {
        all: todayTotal,
        successful: todaySuccessful,
        failed: todayFailed,
      },
      successRate: totalValidations > 0 ? (successfulValidations / totalValidations) * 100 : 0,
    };
  }

  async getRecentActivity(limit = 10) {
    return this.prisma.validationLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cedula: true,
            photo: true,
          },
        },
      },
      orderBy: { validatedAt: 'desc' },
      take: limit,
    });
  }

  async getValidationTrends(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const logs = await this.prisma.validationLog.findMany({
      where: {
        validatedAt: {
          gte: startDate,
        },
      },
      select: {
        validatedAt: true,
        success: true,
        validationType: true,
      },
    });

    // Group by date
    const trends = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      trends[dateKey] = {
        date: dateKey,
        total: 0,
        successful: 0,
        failed: 0,
        cedula: 0,
        holler: 0,
      };
    }

    logs.forEach((log) => {
      const dateKey = log.validatedAt.toISOString().split('T')[0];
      if (trends[dateKey]) {
        trends[dateKey].total++;
        if (log.success) {
          trends[dateKey].successful++;
        } else {
          trends[dateKey].failed++;
        }
        if (log.validationType === 'CEDULA') {
          trends[dateKey].cedula++;
        } else if (log.validationType === 'HOLLER') {
          trends[dateKey].holler++;
        }
      }
    });

    return Object.values(trends).reverse();
  }
}