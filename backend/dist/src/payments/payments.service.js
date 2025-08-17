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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPaymentDto) {
        return this.prisma.payment.create({
            data: {
                ...createPaymentDto,
                status: 'PENDING',
                transactionId: createPaymentDto.transactionId || `TXN${Date.now()}`,
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
                membership: {
                    include: {
                        plan: true,
                    },
                },
            },
        });
    }
    async findAll(page = 1, limit = 10, status, method, userId, startDate, endDate) {
        const offset = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (method)
            where.method = method;
        if (userId)
            where.userId = userId;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
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
                    membership: {
                        include: {
                            plan: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            this.prisma.payment.count({ where }),
        ]);
        return {
            payments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
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
                membership: {
                    include: {
                        plan: true,
                    },
                },
                invoice: true,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async update(id, updatePaymentDto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.prisma.payment.update({
            where: { id },
            data: updatePaymentDto,
            include: {
                user: {
                    select: {
                        id: true,
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
        });
    }
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.prisma.payment.delete({
            where: { id },
        });
        return { message: 'Payment deleted successfully' };
    }
    async processPayment(id) {
        return this.update(id, { status: 'COMPLETED' });
    }
    async refundPayment(id) {
        return this.update(id, { status: 'REFUNDED' });
    }
    async failPayment(id) {
        return this.update(id, { status: 'FAILED' });
    }
    async getPaymentStats() {
        const [totalPayments, completedPayments, pendingPayments, failedPayments, refundedPayments,] = await Promise.all([
            this.prisma.payment.count(),
            this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
            this.prisma.payment.count({ where: { status: 'PENDING' } }),
            this.prisma.payment.count({ where: { status: 'FAILED' } }),
            this.prisma.payment.count({ where: { status: 'REFUNDED' } }),
        ]);
        const totalRevenue = await this.prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
        });
        const monthlyRevenue = await this.prisma.payment.aggregate({
            where: {
                status: 'COMPLETED',
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: { amount: true },
        });
        return {
            totalPayments,
            completedPayments,
            pendingPayments,
            failedPayments,
            refundedPayments,
            totalRevenue: totalRevenue._sum.amount || 0,
            monthlyRevenue: monthlyRevenue._sum.amount || 0,
        };
    }
    async getRevenueByMonth(year) {
        const payments = await this.prisma.payment.findMany({
            where: {
                status: 'COMPLETED',
                createdAt: {
                    gte: new Date(year, 0, 1),
                    lt: new Date(year + 1, 0, 1),
                },
            },
            select: {
                amount: true,
                createdAt: true,
            },
        });
        const monthlyRevenue = Array(12).fill(0);
        payments.forEach(payment => {
            const month = payment.createdAt.getMonth();
            monthlyRevenue[month] += payment.amount;
        });
        return monthlyRevenue.map((revenue, index) => ({
            month: index + 1,
            revenue,
        }));
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map