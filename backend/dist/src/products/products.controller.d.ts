import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
                unitPrice: number;
                totalPrice: number;
                soldBy: string;
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
    getStats(): Promise<{
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
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
    getLowStock(): Promise<{
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
    findOne(id: string): Promise<{
        isLowStock: boolean;
        totalSales: number;
        totalRevenue: number;
        sales: {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            soldBy: string;
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
        unitPrice: number;
        totalPrice: number;
        soldBy: string;
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
            unitPrice: number;
            totalPrice: number;
            soldBy: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSalesReport(year: number, month?: number): Promise<unknown[]>;
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
        unitPrice: number;
        totalPrice: number;
        soldBy: string;
    }>;
}
