"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MembershipsService = class MembershipsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPlan(createMembershipPlanDto) {
        return this.prisma.membershipPlan.create({
            data: createMembershipPlanDto,
        });
    }
    async findAllPlans(page = 1, limit = 10, isActive) {
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
    async findOnePlan(id) {
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
            throw new common_1.NotFoundException('Membership plan not found');
        }
        return plan;
    }
    async updatePlan(id, updateMembershipPlanDto) {
        const plan = await this.prisma.membershipPlan.findUnique({
            where: { id },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Membership plan not found');
        }
        return this.prisma.membershipPlan.update({
            where: { id },
            data: updateMembershipPlanDto,
        });
    }
    async removePlan(id) {
        const plan = await this.prisma.membershipPlan.findUnique({
            where: { id },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Membership plan not found');
        }
        await this.prisma.membershipPlan.delete({
            where: { id },
        });
        return { message: 'Membership plan deleted successfully' };
    }
    async createMembership(createMembershipDto) {
        const { userId, planId, startDate } = createMembershipDto;
        const plan = await this.prisma.membershipPlan.findUnique({
            where: { id: planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Membership plan not found');
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
    async findAllMemberships(page = 1, limit = 10, status, userId) {
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
    async findOneMembership(id) {
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
            throw new common_1.NotFoundException('Membership not found');
        }
        return membership;
    }
    async updateMembership(id, updateData) {
        const membership = await this.prisma.membership.findUnique({
            where: { id },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
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
    async removeMembership(id) {
        const membership = await this.prisma.membership.findUnique({
            where: { id },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        await this.prisma.membership.delete({
            where: { id },
        });
        return { message: 'Membership deleted successfully' };
    }
    async renewMembership(id) {
        const membership = await this.prisma.membership.findUnique({
            where: { id },
            include: { plan: true },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
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
    async suspendMembership(id) {
        return this.updateMembership(id, { status: 'SUSPENDED' });
    }
    async activateMembership(id) {
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
    async validateMembership(membershipId) {
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
        let status;
        let message;
        let isValid;
        if (isUserInactive) {
            status = 'USER_INACTIVE';
            message = 'User account is inactive';
            isValid = false;
        }
        else if (isSuspended) {
            status = 'SUSPENDED';
            message = 'Membership is suspended';
            isValid = false;
        }
        else if (isExpired) {
            status = 'EXPIRED';
            message = 'Membership has expired';
            isValid = false;
        }
        else if (membership.status === 'ACTIVE') {
            status = 'ACTIVE';
            message = 'Membership is valid and active';
            isValid = true;
        }
        else {
            status = 'INACTIVE';
            message = 'Membership is not active';
            isValid = false;
        }
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
    async validateMembershipByUserId(userId) {
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
    async validateMembershipByCedula(cedula) {
        const user = await this.prisma.user.findUnique({
            where: { cedula },
            select: { id: true, isActive: true, firstName: true, lastName: true, cedula: true, photo: true },
        });
        if (!user) {
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
                membership: null,
            };
        }
        const activeMembership = await this.prisma.membership.findFirst({
            where: {
                userId: user.id,
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
                        cedula: true,
                        photo: true,
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
            await this.prisma.validationLog.create({
                data: {
                    userId: user.id,
                    identifier: cedula,
                    validationType: 'CEDULA',
                    success: false,
                    reason: 'Sin membresía activa',
                },
            });
            return {
                isValid: false,
                status: 'NO_ACTIVE_MEMBERSHIP',
                message: `${user.firstName} ${user.lastName} no tiene membresía activa`,
                membership: null,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    cedula: cedula,
                },
            };
        }
        const validation = await this.validateMembership(activeMembership.id);
        await this.prisma.validationLog.create({
            data: {
                userId: user.id,
                identifier: cedula,
                validationType: 'CEDULA',
                success: validation.isValid,
                reason: validation.isValid ? null : validation.message,
            },
        });
        return validation;
    }
    async validateMembershipByHoller(holler) {
        const user = await this.prisma.user.findFirst({
            where: { holler },
            select: { id: true, isActive: true, firstName: true, lastName: true, cedula: true, photo: true },
        });
        if (!user) {
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
                membership: null,
            };
        }
        const activeMembership = await this.prisma.membership.findFirst({
            where: {
                userId: user.id,
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
            orderBy: { endDate: 'desc' },
        });
        if (!activeMembership) {
            await this.prisma.validationLog.create({
                data: {
                    userId: user.id,
                    identifier: holler,
                    validationType: 'HOLLER',
                    success: false,
                    reason: 'Sin membresía activa',
                },
            });
            return {
                isValid: false,
                status: 'NO_ACTIVE_MEMBERSHIP',
                message: `${user.firstName} ${user.lastName} no tiene membresía activa`,
                membership: null,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    cedula: user.cedula,
                    photo: user.photo,
                },
            };
        }
        const validation = await this.validateMembership(activeMembership.id);
        await this.prisma.validationLog.create({
            data: {
                userId: user.id,
                identifier: holler,
                validationType: 'HOLLER',
                success: validation.isValid,
                reason: validation.isValid ? null : validation.message,
            },
        });
        return validation;
    }
};
exports.MembershipsService = MembershipsService;
exports.MembershipsService = MembershipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipsService);
//# sourceMappingURL=memberships.service.js.map