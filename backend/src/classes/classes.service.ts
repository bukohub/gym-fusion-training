import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { BookClassDto } from './dto/book-class.dto';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto) {
    const { startTime, endTime, trainerId } = createClassDto;

    // Check if trainer exists and has TRAINER role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    if (trainer.role !== 'TRAINER') {
      throw new BadRequestException('User is not a trainer');
    }

    // Check for time conflicts
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
      throw new ConflictException('Trainer has a conflicting class at this time');
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

  async findAll(
    page = 1,
    limit = 10,
    status?: string,
    trainerId?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const offset = (page - 1) * limit;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (trainerId) where.trainerId = trainerId;
    
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
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

  async findOne(id: string) {
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
      throw new NotFoundException('Class not found');
    }

    return {
      ...classItem,
      currentCapacity: classItem.bookings.length,
      availableSpots: classItem.maxCapacity - classItem.bookings.length,
    };
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const classItem = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    // If updating trainer, check if new trainer exists and is a trainer
    if (updateClassDto.trainerId) {
      const trainer = await this.prisma.user.findUnique({
        where: { id: updateClassDto.trainerId },
      });

      if (!trainer) {
        throw new NotFoundException('Trainer not found');
      }

      if (trainer.role !== 'TRAINER') {
        throw new BadRequestException('User is not a trainer');
      }
    }

    const updateData: any = { ...updateClassDto };
    if (updateClassDto.startTime) updateData.startTime = new Date(updateClassDto.startTime);
    if (updateClassDto.endTime) updateData.endTime = new Date(updateClassDto.endTime);

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

  async remove(id: string) {
    const classItem = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    await this.prisma.class.delete({
      where: { id },
    });

    return { message: 'Class deleted successfully' };
  }

  // Class Booking Operations
  async bookClass(bookClassDto: BookClassDto) {
    const { userId, classId } = bookClassDto;

    // Check if class exists and is not full
    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        bookings: true,
      },
    });

    if (!classItem) {
      throw new NotFoundException('Class not found');
    }

    if (classItem.status !== 'SCHEDULED') {
      throw new BadRequestException('Class is not available for booking');
    }

    if (classItem.bookings.length >= classItem.maxCapacity) {
      throw new BadRequestException('Class is full');
    }

    // Check if user already booked this class
    const existingBooking = await this.prisma.classBooking.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    if (existingBooking) {
      throw new ConflictException('User already booked this class');
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

  async cancelBooking(userId: string, classId: string) {
    const booking = await this.prisma.classBooking.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
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

  async markAttendance(bookingId: string, attended: boolean) {
    const booking = await this.prisma.classBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
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
    const [
      totalClasses,
      scheduledClasses,
      completedClasses,
      cancelledClasses,
      totalBookings,
    ] = await Promise.all([
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

  async getUserBookings(userId: string, page = 1, limit = 10) {
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
}