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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ClassesService = class ClassesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createClassDto) {
        const { startTime, endTime, trainerId } = createClassDto;
        const trainer = await this.prisma.user.findUnique({
            where: { id: trainerId },
        });
        if (!trainer) {
            throw new common_1.NotFoundException('Trainer not found');
        }
        if (trainer.role !== 'TRAINER') {
            throw new common_1.BadRequestException('User is not a trainer');
        }
        const conflictingClass = await this.prisma.class.findFirst({
            where: {
                trainerId,
                status: 'SCHEDULED',
                OR: [
                    {
                        startTime: {
                            lte: new Date(endTime),
                        },
                        endTime: {
                            gte: new Date(startTime),
                        },
                    },
                ],
            },
        });
        if (conflictingClass) {
            throw new common_1.ConflictException('Trainer has a conflicting class at this time');
        }
        return this.prisma.class.create({
            data: {
                ...createClassDto,
                startTime: new Date(createClassDto.startTime),
                endTime: new Date(createClassDto.endTime),
                status: 'SCHEDULED',
            },
            include: {
                trainer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                bookings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findAll(page = 1, limit = 10, status, trainerId, startDate, endDate) {
        const offset = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (trainerId)
            where.trainerId = trainerId;
        if (startDate || endDate) {
            where.startTime = {};
            if (startDate)
                where.startTime.gte = new Date(startDate);
            if (endDate)
                where.startTime.lte = new Date(endDate);
        }
        const [classes, total] = await Promise.all([
            this.prisma.class.findMany({
                where,
                include: {
                    trainer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    bookings: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { startTime: 'asc' },
                skip: offset,
                take: limit,
            }),
            this.prisma.class.count({ where }),
        ]);
        return {
            classes: classes.map(classItem => ({
                ...classItem,
                currentCapacity: classItem.bookings.length,
                availableSpots: classItem.maxCapacity - classItem.bookings.length,
            })),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
            include: {
                trainer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                bookings: {
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
                    },
                    orderBy: { bookedAt: 'asc' },
                },
            },
        });
        if (!classItem) {
            throw new common_1.NotFoundException('Class not found');
        }
        return {
            ...classItem,
            currentCapacity: classItem.bookings.length,
            availableSpots: classItem.maxCapacity - classItem.bookings.length,
        };
    }
    async update(id, updateClassDto) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
        });
        if (!classItem) {
            throw new common_1.NotFoundException('Class not found');
        }
        if (updateClassDto.trainerId) {
            const trainer = await this.prisma.user.findUnique({
                where: { id: updateClassDto.trainerId },
            });
            if (!trainer) {
                throw new common_1.NotFoundException('Trainer not found');
            }
            if (trainer.role !== 'TRAINER') {
                throw new common_1.BadRequestException('User is not a trainer');
            }
        }
        const updateData = { ...updateClassDto };
        if (updateClassDto.startTime)
            updateData.startTime = new Date(updateClassDto.startTime);
        if (updateClassDto.endTime)
            updateData.endTime = new Date(updateClassDto.endTime);
        return this.prisma.class.update({
            where: { id },
            data: updateData,
            include: {
                trainer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                bookings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async remove(id) {
        const classItem = await this.prisma.class.findUnique({
            where: { id },
        });
        if (!classItem) {
            throw new common_1.NotFoundException('Class not found');
        }
        await this.prisma.class.delete({
            where: { id },
        });
        return { message: 'Class deleted successfully' };
    }
    async bookClass(bookClassDto) {
        const { userId, classId } = bookClassDto;
        const classItem = await this.prisma.class.findUnique({
            where: { id: classId },
            include: {
                bookings: true,
            },
        });
        if (!classItem) {
            throw new common_1.NotFoundException('Class not found');
        }
        if (classItem.status !== 'SCHEDULED') {
            throw new common_1.BadRequestException('Class is not available for booking');
        }
        if (classItem.bookings.length >= classItem.maxCapacity) {
            throw new common_1.BadRequestException('Class is full');
        }
        const existingBooking = await this.prisma.classBooking.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId,
                },
            },
        });
        if (existingBooking) {
            throw new common_1.ConflictException('User already booked this class');
        }
        return this.prisma.classBooking.create({
            data: {
                userId,
                classId,
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
                class: {
                    include: {
                        trainer: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async cancelBooking(userId, classId) {
        const booking = await this.prisma.classBooking.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId,
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        await this.prisma.classBooking.delete({
            where: {
                userId_classId: {
                    userId,
                    classId,
                },
            },
        });
        return { message: 'Booking cancelled successfully' };
    }
    async markAttendance(bookingId, attended) {
        const booking = await this.prisma.classBooking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return this.prisma.classBooking.update({
            where: { id: bookingId },
            data: { attended },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                class: true,
            },
        });
    }
    async getClassStats() {
        const [totalClasses, scheduledClasses, completedClasses, cancelledClasses, totalBookings,] = await Promise.all([
            this.prisma.class.count(),
            this.prisma.class.count({ where: { status: 'SCHEDULED' } }),
            this.prisma.class.count({ where: { status: 'COMPLETED' } }),
            this.prisma.class.count({ where: { status: 'CANCELLED' } }),
            this.prisma.classBooking.count(),
        ]);
        const attendanceStats = await this.prisma.classBooking.groupBy({
            by: ['attended'],
            _count: true,
        });
        const attendedCount = attendanceStats.find(stat => stat.attended)?._count || 0;
        const totalAttendanceRecords = attendanceStats.reduce((sum, stat) => sum + stat._count, 0);
        const attendanceRate = totalAttendanceRecords > 0 ? (attendedCount / totalAttendanceRecords) * 100 : 0;
        return {
            totalClasses,
            scheduledClasses,
            completedClasses,
            cancelledClasses,
            totalBookings,
            attendanceRate: Math.round(attendanceRate * 100) / 100,
        };
    }
    async getUpcomingClasses(limit = 10) {
        return this.prisma.class.findMany({
            where: {
                status: 'SCHEDULED',
                startTime: {
                    gte: new Date(),
                },
            },
            include: {
                trainer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                bookings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
            orderBy: { startTime: 'asc' },
            take: limit,
        });
    }
    async getUserBookings(userId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [bookings, total] = await Promise.all([
            this.prisma.classBooking.findMany({
                where: { userId },
                include: {
                    class: {
                        include: {
                            trainer: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { bookedAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            this.prisma.classBooking.count({ where: { userId } }),
        ]);
        return {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map