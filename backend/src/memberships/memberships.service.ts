import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  // Membership Plans CRUD
  async createPlan(createMembershipPlanDto: CreateMembershipPlanDto) {
    return this.prisma.membershipPlan.create({
      data: createMembershipPlanDto,
    });
  }

  async findAllPlans(page = 1, limit = 10, isActive?: boolean) {
    const offset = (page - 1) * limit;
    
    const where = {
      ...(isActive !== undefined && { isActive }),
    };

    const [plans, total] = await Promise.all([
      this.prisma.membershipPlan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.membershipPlan.count({ where }),
    ]);

    return {
      plans,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOnePlan(id: string) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!plan) {
      throw new NotFoundException('Membership plan not found');
    }

    return plan;
  }

  async updatePlan(id: string, updateMembershipPlanDto: UpdateMembershipPlanDto) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Membership plan not found');
    }

    return this.prisma.membershipPlan.update({
      where: { id },
      data: updateMembershipPlanDto,
    });
  }

  async removePlan(id: string) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Membership plan not found');
    }

    await this.prisma.membershipPlan.delete({
      where: { id },
    });

    return { message: 'Membership plan deleted successfully' };
  }

  // Memberships CRUD
  async createMembership(createMembershipDto: CreateMembershipDto) {
    const { userId, planId, startDate } = createMembershipDto;

    // Get the plan to calculate end date
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Membership plan not found');
    }

    const membershipStartDate = startDate ? new Date(startDate) : new Date();
    const endDate = new Date(membershipStartDate);
    endDate.setDate(membershipStartDate.getDate() + plan.duration);

    return this.prisma.membership.create({
      data: {
        userId,
        planId,
        startDate: membershipStartDate,
        endDate,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        plan: true,
      },
    });
  }

  async findAllMemberships(page = 1, limit = 10, status?: string, userId?: string) {
    const offset = (page - 1) * limit;
    
    const where = {
      ...(status && { status }),
      ...(userId && { userId }),
    };

    const [memberships, total] = await Promise.all([
      this.prisma.membership.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          plan: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.membership.count({ where }),
    ]);

    return {
      memberships,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneMembership(id: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }

  async updateMembership(id: string, updateData: any) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return this.prisma.membership.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        plan: true,
      },
    });
  }

  async removeMembership(id: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    await this.prisma.membership.delete({
      where: { id },
    });

    return { message: 'Membership deleted successfully' };
  }

  async renewMembership(id: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    const newStartDate = new Date();
    const newEndDate = new Date();
    newEndDate.setDate(newStartDate.getDate() + membership.plan.duration);

    return this.prisma.membership.update({
      where: { id },
      data: {
        startDate: newStartDate,
        endDate: newEndDate,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        plan: true,
      },
    });
  }

  async suspendMembership(id: string) {
    return this.updateMembership(id, { status: 'SUSPENDED' });
  }

  async activateMembership(id: string) {
    return this.updateMembership(id, { status: 'ACTIVE' });
  }

  async getExpiringMemberships(days = 7) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    return this.prisma.membership.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: targetDate,
          gte: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        plan: true,
      },
      orderBy: { endDate: 'asc' },
    });
  }

  async getMembershipStats() {
    const [total, active, expired, suspended] = await Promise.all([
      this.prisma.membership.count(),
      this.prisma.membership.count({ where: { status: 'ACTIVE' } }),
      this.prisma.membership.count({ where: { status: 'EXPIRED' } }),
      this.prisma.membership.count({ where: { status: 'SUSPENDED' } }),
    ]);

    const expiringThisWeek = await this.prisma.membership.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        },
      },
    });

    return {
      total,
      active,
      expired,
      suspended,
      expiringThisWeek,
    };
  }
}