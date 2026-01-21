import { ValidationLogsService } from './validation-logs.service';
export declare class ValidationLogsController {
    private readonly validationLogsService;
    constructor(validationLogsService: ValidationLogsService);
    findAll(page?: number, limit?: number, validationType?: string, success?: boolean, startDate?: string, endDate?: string, userId?: string): Promise<{
        logs: ({
            user: {
                firstName: string;
                lastName: string;
                cedula: string;
                photo: string;
                id: string;
            };
        } & {
            id: string;
            userId: string | null;
            identifier: string;
            validationType: string;
            success: boolean;
            reason: string | null;
            validatedAt: Date;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        total: {
            all: number;
            successful: number;
            failed: number;
            cedula: number;
            holler: number;
        };
        today: {
            all: number;
            successful: number;
            failed: number;
        };
        successRate: number;
    }>;
    getRecentActivity(limit?: number): Promise<({
        user: {
            firstName: string;
            lastName: string;
            cedula: string;
            photo: string;
            id: string;
        };
    } & {
        id: string;
        userId: string | null;
        identifier: string;
        validationType: string;
        success: boolean;
        reason: string | null;
        validatedAt: Date;
    })[]>;
    getValidationTrends(days?: number): Promise<unknown[]>;
}
