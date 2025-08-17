import { PrismaService } from '../common/prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { BookClassDto } from './dto/book-class.dto';
export declare class ClassesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClassDto: CreateClassDto): Promise<{
        trainer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        bookings: ({
            user: {
                id: string;
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
    } & {
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
    }>;
    findAll(page?: number, limit?: number, status?: string, trainerId?: string, startDate?: string, endDate?: string): Promise<{
        classes: {
            currentCapacity: number;
            availableSpots: number;
            trainer: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            bookings: ({
                user: {
                    id: string;
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        currentCapacity: number;
        availableSpots: number;
        trainer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
        bookings: ({
            user: {
                id: string;
                email: string;
                cedula: string;
                firstName: string;
                lastName: string;
                phone: string;
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
    }>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<{
        trainer: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        bookings: ({
            user: {
                id: string;
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
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    bookClass(bookClassDto: BookClassDto): Promise<{
        user: {
            id: string;
            email: string;
            cedula: string;
            firstName: string;
            lastName: string;
        };
        class: {
            trainer: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        bookedAt: Date;
        attended: boolean;
    }>;
    cancelBooking(userId: string, classId: string): Promise<{
        message: string;
    }>;
    markAttendance(bookingId: string, attended: boolean): Promise<{
        user: {
            id: string;
            cedula: string;
            firstName: string;
            lastName: string;
        };
        class: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        classId: string;
        bookedAt: Date;
        attended: boolean;
    }>;
    getClassStats(): Promise<{
        totalClasses: number;
        scheduledClasses: number;
        completedClasses: number;
        cancelledClasses: number;
        totalBookings: number;
        attendanceRate: number;
    }>;
    getUpcomingClasses(limit?: number): Promise<({
        trainer: {
            id: string;
            firstName: string;
            lastName: string;
        };
        bookings: ({
            user: {
                id: string;
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
    } & {
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
    })[]>;
    getUserBookings(userId: string, page?: number, limit?: number): Promise<{
        bookings: ({
            class: {
                trainer: {
                    id: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
