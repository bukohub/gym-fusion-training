import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    findAll(page?: number, limit?: number, category?: string, isActive?: boolean, lowStock?: boolean, search?: string): Promise<{
        products: {
            isLowStock: boolean;
            totalSales: number;
            sales: {
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                soldBy: string;
                unitPrice: number;
                totalPrice: number;
            }[];
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            minStock: number;
            category: string;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        isLowStock: boolean;
        totalSales: number;
        totalRevenue: number;
        sales: {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            soldBy: string;
            unitPrice: number;
            totalPrice: number;
        }[];
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number, operation?: 'add' | 'subtract'): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    getLowStockProducts(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }[]>;
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
    createSale(createSaleDto: CreateSaleDto): Promise<{
        product: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            minStock: number;
            category: string;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        soldBy: string;
        unitPrice: number;
        totalPrice: number;
    }>;
    findAllSales(page?: number, limit?: number, productId?: string, soldBy?: string, startDate?: string, endDate?: string): Promise<{
        sales: ({
            product: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                stock: number;
                minStock: number;
                category: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            soldBy: string;
            unitPrice: number;
            totalPrice: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOneSale(id: string): Promise<{
        product: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            minStock: number;
            category: string;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        quantity: number;
        soldBy: string;
        unitPrice: number;
        totalPrice: number;
    }>;
    getProductStats(): Promise<{
        totalProducts: number;
        activeProducts: number;
        inactiveProducts: number;
        totalCategories: number;
        totalSales: number;
        lowStockCount: number;
        totalRevenue: number;
        topSellingProducts: {
            totalSold: number;
            salesCount: number;
            id: string;
            name: string;
            price: number;
        }[];
    }>;
    getSalesReport(year: number, month?: number): Promise<unknown[]>;
}
