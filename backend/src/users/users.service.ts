import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/constants/roles';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check for existing user by email if email is provided
    if (createUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Check for existing user by cedula if cedula is provided
    if (createUserDto.cedula) {
      const existingUserByCedula = await this.prisma.user.findUnique({
        where: { cedula: createUserDto.cedula },
      });

      if (existingUserByCedula) {
        throw new ConflictException('User with this cedula already exists');
      }
    }

    // For clients, password can be empty - generate a default one
    let password = createUserDto.password;
    if (!password && createUserDto.role === Role.CLIENT) {
      // Generate a default password based on cedula for clients, fallback to random string
      password = createUserDto.cedula ? `gym${createUserDto.cedula}` : `gym${Date.now()}`;
    }

    // If still no password, create a default one
    if (!password) {
      password = 'defaultPassword123';
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cedula: true,
        phone: true,
        role: true,
        avatar: true,
        photo: true,
        holler: true,
        weight: true,
        height: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, role?: Role, isActive?: boolean, search?: string) {
    const offset = (page - 1) * limit;
    
    const where = {
      ...(role && { role }),
      ...(typeof isActive === 'boolean' && { isActive }),
      ...(search && {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { cedula: { contains: search } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          cedula: true,
          phone: true,
          role: true,
          avatar: true,
          photo: true,
          holler: true,
          weight: true,
          height: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cedula: true,
        phone: true,
        role: true,
        avatar: true,
        photo: true,
        holler: true,
        weight: true,
        height: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        memberships: {
          include: {
            plan: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        bookedClasses: {
          include: {
            class: {
              include: {
                trainer: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.cedula && updateUserDto.cedula !== user.cedula) {
      const existingUserByCedula = await this.prisma.user.findUnique({
        where: { cedula: updateUserDto.cedula },
      });

      if (existingUserByCedula) {
        throw new ConflictException('Cedula already in use');
      }
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cedula: true,
        phone: true,
        role: true,
        avatar: true,
        photo: true,
        holler: true,
        weight: true,
        height: true,
        isActive: true,
        emailVerified: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cedula: true,
        photo: true,
        holler: true,
        weight: true,
        height: true,
        isActive: true,
      },
    });
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cedula: true,
        photo: true,
        holler: true,
        weight: true,
        height: true,
        isActive: true,
      },
    });
  }

  async getUserStats() {
    const [totalUsers, activeUsers, clientCount, trainerCount, receptionistCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: Role.CLIENT } }),
      this.prisma.user.count({ where: { role: Role.TRAINER } }),
      this.prisma.user.count({ where: { role: Role.RECEPTIONIST } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      roleDistribution: {
        clients: clientCount,
        trainers: trainerCount,
        receptionists: receptionistCount,
        admins: totalUsers - clientCount - trainerCount - receptionistCount,
      },
    };
  }
}