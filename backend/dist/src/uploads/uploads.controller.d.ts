import { Response } from 'express';
export declare class UploadsController {
    private readonly uploadPath;
    constructor();
    uploadPhoto(file: Express.Multer.File): Promise<{
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
        url: string;
    }>;
    getPhoto(filename: string, res: Response): Promise<Response<any, Record<string, any>>>;
    private getContentType;
}
