import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { BookClassDto } from './dto/book-class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(createClassDto: CreateClassDto): Promise<{
        trainer: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        bookings: ({
            user: {
                firstName: string;
                lastName: string;
                cedula: string;
                id: string;
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
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        trainerId: string;
        startTime: Date;
        endTime: Date;
        maxCapacity: number;
    }>;
    findAll(page?: number, limit?: number, status?: string, trainerId?: string, startDate?: string, endDate?: string): Promise<{
        classes: {
            currentCapacity: number;
            availableSpots: number;
            trainer: {
                email: string;
                firstName: string;
                lastName: string;
                id: string;
            };
            bookings: ({
                user: {
                    firstName: string;
                    lastName: string;
                    cedula: string;
                    id: string;
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
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            trainerId: string;
            startTime: Date;
            endTime: Date;
            maxCapacity: number;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        totalClasses: number;
        scheduledClasses: number;
        completedClasses: number;
        cancelledClasses: number;
        totalBookings: number;
        attendanceRate: number;
    }>;
    getUpcoming(limit?: number): Promise<({
        trainer: {
            firstName: string;
            lastName: string;
            id: string;
        };
        bookings: ({
            user: {
                firstName: string;
                lastName: string;
                cedula: string;
                id: string;
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
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        trainerId: string;
        startTime: Date;
        endTime: Date;
        maxCapacity: number;
    })[]>;
    getUserBookings(userId: string, page?: number, limit?: number): Promise<{
        bookings: ({
            class: {
                trainer: {
                    firstName: string;
                    lastName: string;
                    id: string;
                };
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                trainerId: string;
                startTime: Date;
                endTime: Date;
                maxCapacity: number;
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
    findOne(id: string): Promise<{
        currentCapacity: number;
        availableSpots: number;
        trainer: {
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            id: string;
        };
        bookings: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
                cedula: string;
                phone: string;
                id: string;
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
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        trainerId: string;
        startTime: Date;
        endTime: Date;
        maxCapacity: number;
    }>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<{
        trainer: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
        bookings: ({
            user: {
                firstName: string;
                lastName: string;
                cedula: string;
                id: string;
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
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        trainerId: string;
        startTime: Date;
        endTime: Date;
        maxCapacity: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    bookClass(bookClassDto: BookClassDto): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        class: {
            trainer: {
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            trainerId: string;
            startTime: Date;
            endTime: Date;
            maxCapacity: number;
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
            firstName: string;
            lastName: string;
            cedula: string;
            id: string;
        };
        class: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            trainerId: string;
            startTime: Date;
            endTime: Date;
            maxCapacity: number;
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
}
