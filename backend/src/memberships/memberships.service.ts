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

  async validateMembership(membershipId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
            cedula: true,
            photo: true,
            holler: true,
          },
        },
        plan: {
          select: {
            name: true,
            duration: true,
          },
        },
      },
    });

    if (!membership) {
      return {
        isValid: false,
        status: 'NOT_FOUND',
        message: 'Membership not found',
        membership: null,
      };
    }

    const now = new Date();
    const isExpired = membership.endDate < now;
    const isSuspended = membership.status === 'SUSPENDED';
    const isUserInactive = !membership.user.isActive;

    let status: string;
    let message: string;
    let isValid: boolean;

    if (isUserInactive) {
      status = 'USER_INACTIVE';
      message = 'User account is inactive';
      isValid = false;
    } else if (isSuspended) {
      status = 'SUSPENDED';
      message = 'Membership is suspended';
      isValid = false;
    } else if (isExpired) {
      status = 'EXPIRED';
      message = 'Membership has expired';
      isValid = false;
    } else if (membership.status === 'ACTIVE') {
      status = 'ACTIVE';
      message = 'Membership is valid and active';
      isValid = true;
    } else {
      status = 'INACTIVE';
      message = 'Membership is not active';
      isValid = false;
    }

    // Calculate days remaining
    const daysRemaining = isExpired ? 0 : Math.ceil((membership.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      isValid,
      status,
      message,
      membership: {
        id: membership.id,
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status,
        daysRemaining,
        user: membership.user,
        plan: membership.plan,
      },
    };
  }

  async validateMembershipByUserId(userId: string) {
    const activeMembership = await this.prisma.membership.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
          },
        },
        plan: {
          select: {
            name: true,
            duration: true,
          },
        },
      },
      orderBy: { endDate: 'desc' },
    });

    if (!activeMembership) {
      return {
        isValid: false,
        status: 'NO_ACTIVE_MEMBERSHIP',
        message: 'No active membership found for this user',
        membership: null,
      };
    }

    return this.validateMembership(activeMembership.id);
  }

  async validateMembershipByCedula(cedula: string) {
    // First find the user by cedula
    const user = await this.prisma.user.findUnique({
      where: { cedula },
      select: { id: true, isActive: true, firstName: true, lastName: true, cedula: true, photo: true },
    });

    if (!user) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: null,
          identifier: cedula,
          validationType: 'CEDULA',
          success: false,
          reason: 'Usuario no encontrado',
        },
      });

      return {
        isValid: false,
        status: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado con esta cédula',
        payment: null,
      };
    }

    if (!user.isActive) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: cedula,
          validationType: 'CEDULA',
          success: false,
          reason: 'Usuario inactivo',
        },
      });

      return {
        isValid: false,
        status: 'USER_INACTIVE',
        message: `${user.firstName} ${user.lastName} tiene cuenta inactiva`,
        payment: null,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: cedula,
          photo: user.photo,
        },
      };
    }

    // Get user's active membership to determine plan duration
    const userMembership = await this.prisma.membership.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!userMembership) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: cedula,
          validationType: 'CEDULA',
          success: false,
          reason: 'Usuario sin plan de membresía',
        },
      });

      return {
        isValid: false,
        status: 'NO_MEMBERSHIP_PLAN',
        message: `${user.firstName} ${user.lastName} no tiene un plan de membresía asignado`,
        payment: null,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: cedula,
          photo: user.photo,
        },
      };
    }

    // Find the most recent completed payment
    const recentPayment = await this.prisma.payment.findFirst({
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
            cedula: true,
            photo: true,
          },
        },
        membership: {
          include: {
            plan: {
              select: {
                name: true,
                duration: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!recentPayment) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: cedula,
          validationType: 'CEDULA',
          success: false,
          reason: 'Sin pagos completados',
        },
      });

      return {
        isValid: false,
        status: 'NO_COMPLETED_PAYMENT',
        message: `${user.firstName} ${user.lastName} no tiene pagos completados`,
        payment: null,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: cedula,
          photo: user.photo,
        },
      };
    }

    // Calculate days since last payment
    const daysSincePayment = Math.floor((Date.now() - recentPayment.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const planDurationDays = userMembership.plan.duration;
    const daysUntilExpiry = Math.max(0, planDurationDays - daysSincePayment);
    const isPaymentValid = daysSincePayment <= planDurationDays;

    if (!isPaymentValid) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: cedula,
          validationType: 'CEDULA',
          success: false,
          reason: `Pago expirado. Plan de ${planDurationDays} días, último pago hace ${daysSincePayment} días`,
        },
      });

      return {
        isValid: false,
        status: 'PAYMENT_EXPIRED',
        message: `${user.firstName} ${user.lastName} - pago expirado. Plan de ${planDurationDays} días, último pago hace ${daysSincePayment} días`,
        payment: {
          id: recentPayment.id,
          amount: recentPayment.amount,
          method: recentPayment.method,
          description: recentPayment.description,
          paymentDate: recentPayment.createdAt,
          daysSincePayment,
          daysUntilExpiry,
          user: recentPayment.user,
          membership: recentPayment.membership,
        },
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: cedula,
          photo: user.photo,
        },
      };
    }

    // Log successful validation
    await this.prisma.validationLog.create({
      data: {
        userId: user.id,
        identifier: cedula,
        validationType: 'CEDULA',
        success: true,
        reason: null,
      },
    });

    return {
      isValid: true,
      status: 'PAYMENT_VALID',
      message: `${user.firstName} ${user.lastName} tiene pago válido (${daysUntilExpiry} días restantes)`,
      payment: {
        id: recentPayment.id,
        amount: recentPayment.amount,
        method: recentPayment.method,
        description: recentPayment.description,
        paymentDate: recentPayment.createdAt,
        daysSincePayment,
        daysUntilExpiry,
        user: recentPayment.user,
        membership: recentPayment.membership,
        plan: {
          name: userMembership.plan.name,
          duration: userMembership.plan.duration,
          price: userMembership.plan.price,
        },
      },
    };
  }

  async validateMembershipByHoller(holler: string) {
    // First find the user by holler
    const user = await this.prisma.user.findFirst({
      where: { holler },
      select: { id: true, isActive: true, firstName: true, lastName: true, cedula: true, photo: true, holler: true },
    });

    if (!user) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: null,
          identifier: holler,
          validationType: 'HOLLER',
          success: false,
          reason: 'Usuario no encontrado',
        },
      });

      return {
        isValid: false,
        status: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado con este holler',
        payment: null,
      };
    }

    if (!user.isActive) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: holler,
          validationType: 'HOLLER',
          success: false,
          reason: 'Usuario inactivo',
        },
      });

      return {
        isValid: false,
        status: 'USER_INACTIVE',
        message: `${user.firstName} ${user.lastName} tiene cuenta inactiva`,
        payment: null,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: user.cedula,
          photo: user.photo,
          holler: user.holler,
        },
      };
    }

    // Get user's active membership to determine plan duration
    const userMembership = await this.prisma.membership.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!userMembership) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: holler,
          validationType: 'HOLLER',
          success: false,
          reason: 'Usuario sin plan de membresía',
        },
      });

      return {
        isValid: false,
        status: 'NO_MEMBERSHIP_PLAN',
        message: `${user.firstName} ${user.lastName} no tiene un plan de membresía asignado`,
        payment: null,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: user.cedula,
          photo: user.photo,
          holler: user.holler,
        },
      };
    }

    // Find the most recent completed payment
    const recentPayment = await this.prisma.payment.findFirst({
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true,
            cedula: true,
            photo: true,
            holler: true,
          },
        },
        membership: {
          include: {
            plan: {
              select: {
                name: true,
                duration: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!recentPayment) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: holler,
          validationType: 'HOLLER',
          success: false,
          reason: 'Sin pagos completados',
        },
      });

      return {
        isValid: false,
        status: 'NO_COMPLETED_PAYMENT',
        message: `${user.firstName} ${user.lastName} no tiene pagos completados`,
        payment: null,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: user.cedula,
          photo: user.photo,
          holler: user.holler,
        },
      };
    }

    // Calculate days since last payment
    const daysSincePayment = Math.floor((Date.now() - recentPayment.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const planDurationDays = userMembership.plan.duration;
    const daysUntilExpiry = Math.max(0, planDurationDays - daysSincePayment);
    const isPaymentValid = daysSincePayment <= planDurationDays;

    if (!isPaymentValid) {
      // Log failed validation attempt
      await this.prisma.validationLog.create({
        data: {
          userId: user.id,
          identifier: holler,
          validationType: 'HOLLER',
          success: false,
          reason: `Pago expirado. Plan de ${planDurationDays} días, último pago hace ${daysSincePayment} días`,
        },
      });

      return {
        isValid: false,
        status: 'PAYMENT_EXPIRED',
        message: `${user.firstName} ${user.lastName} - pago expirado. Plan de ${planDurationDays} días, último pago hace ${daysSincePayment} días`,
        payment: {
          id: recentPayment.id,
          amount: recentPayment.amount,
          method: recentPayment.method,
          description: recentPayment.description,
          paymentDate: recentPayment.createdAt,
          daysSincePayment,
          daysUntilExpiry,
          user: recentPayment.user,
          membership: recentPayment.membership,
        },
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          cedula: user.cedula,
          photo: user.photo,
          holler: user.holler,
        },
      };
    }

    // Log successful validation
    await this.prisma.validationLog.create({
      data: {
        userId: user.id,
        identifier: holler,
        validationType: 'HOLLER',
        success: true,
        reason: null,
      },
    });

    return {
      isValid: true,
      status: 'PAYMENT_VALID',
      message: `${user.firstName} ${user.lastName} tiene pago válido (${daysUntilExpiry} días restantes)`,
      payment: {
        id: recentPayment.id,
        amount: recentPayment.amount,
        method: recentPayment.method,
        description: recentPayment.description,
        paymentDate: recentPayment.createdAt,
        daysSincePayment,
        daysUntilExpiry,
        user: recentPayment.user,
        membership: recentPayment.membership,
        plan: {
          name: userMembership.plan.name,
          duration: userMembership.plan.duration,
          price: userMembership.plan.price,
        },
      },
    };
  }

  async getPaymentStatusReport(
    page = 1,
    limit = 20,
    status: 'expired' | 'expiring_today' | 'expiring_soon' | 'current' | 'all' = 'all',
    expiringDays = 7,
  ) {
    const offset = (page - 1) * limit;

    // Get all users with their memberships and most recent payment
    const usersWithMemberships = await this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      include: {
        payments: {
          where: {
            status: 'COMPLETED',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        memberships: {
          include: {
            plan: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // Process each user to determine payment expiration status
    const processedUsers = usersWithMemberships
      .filter(user => user.memberships.length > 0) // Only users with memberships
      .map(user => {
        const recentPayment = user.payments[0];
        const membership = user.memberships[0];
        const now = new Date();

        if (!recentPayment || !membership.plan) {
          return {
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              cedula: user.cedula,
              photo: user.photo,
            },
            payment: null,
            membership: {
              id: membership.id,
              plan: membership.plan,
              startDate: membership.startDate,
              endDate: membership.endDate,
              status: membership.status,
            },
            status: 'no_payment',
            statusLabel: 'Sin Pagos',
            daysUntilPaymentExpiry: null,
            paymentExpirationDate: null,
            lastPaymentDate: null,
          };
        }

        // Calculate payment expiration: last payment date + plan duration
        const lastPaymentDate = recentPayment.createdAt;
        const planDurationDays = membership.plan.duration;
        const paymentExpirationDate = new Date(lastPaymentDate.getTime() + (planDurationDays * 24 * 60 * 60 * 1000));
        const daysUntilPaymentExpiry = Math.ceil((paymentExpirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let paymentStatus: string;
        let statusLabel: string;

        if (daysUntilPaymentExpiry < 0) {
          paymentStatus = 'expired';
          statusLabel = 'Pago Expirado';
        } else if (daysUntilPaymentExpiry === 0) {
          paymentStatus = 'expiring_today';
          statusLabel = 'Pago Expira Hoy';
        } else if (daysUntilPaymentExpiry <= expiringDays) {
          paymentStatus = 'expiring_soon';
          statusLabel = `Pago expira en ${daysUntilPaymentExpiry} días`;
        } else {
          paymentStatus = 'current';
          statusLabel = `${daysUntilPaymentExpiry} días hasta expirar pago`;
        }

        return {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            cedula: user.cedula,
            photo: user.photo,
          },
          payment: {
            id: recentPayment.id,
            amount: recentPayment.amount,
            method: recentPayment.method,
            description: recentPayment.description,
          },
          membership: {
            id: membership.id,
            plan: membership.plan,
            startDate: membership.startDate,
            endDate: membership.endDate,
            status: membership.status,
          },
          status: paymentStatus,
          statusLabel,
          daysUntilPaymentExpiry,
          paymentExpirationDate,
          lastPaymentDate,
        };
      });

    // Filter based on status
    let filteredUsers = processedUsers;
    if (status !== 'all') {
      filteredUsers = processedUsers.filter(user => user.status === status);
    }

    // Sort by priority: expired first, then expiring today, then expiring soon, then current
    const statusPriority = {
      'expired': 1,
      'expiring_today': 2,
      'expiring_soon': 3,
      'current': 4,
      'no_payment': 5,
    };

    filteredUsers.sort((a, b) => {
      const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 6;
      const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 6;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Secondary sort by days until payment expiry (ascending)
      if (a.daysUntilPaymentExpiry !== null && b.daysUntilPaymentExpiry !== null) {
        return a.daysUntilPaymentExpiry - b.daysUntilPaymentExpiry;
      }

      return 0;
    });

    // Paginate results
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    // Calculate summary statistics
    const stats = {
      total: processedUsers.length,
      expired: processedUsers.filter(u => u.status === 'expired').length,
      expiringToday: processedUsers.filter(u => u.status === 'expiring_today').length,
      expiringSoon: processedUsers.filter(u => u.status === 'expiring_soon').length,
      current: processedUsers.filter(u => u.status === 'current').length,
      noPayment: processedUsers.filter(u => u.status === 'no_payment').length,
    };

    return {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
      filters: {
        status,
        expiringDays,
      },
    };
  }
}