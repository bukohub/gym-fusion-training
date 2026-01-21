import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            name: string;
            description: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
            name: string;
            id: string;
            price: number;
        }[];
    }>;
    getCategories(): Promise<{
        name: string;
        count: number;
    }[]>;
    getLowStock(): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
            soldBy: string;
            unitPrice: number;
            totalPrice: number;
        }[];
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number, operation?: 'add' | 'subtract'): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        stock: number;
        minStock: number;
        category: string;
    }>;
    createSale(createSaleDto: CreateSaleDto): Promise<{
        product: {
            name: string;
            description: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
                name: string;
                description: string | null;
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
    getSalesReport(year: number, month?: number): Promise<unknown[]>;
    findOneSale(id: string): Promise<{
        product: {
            name: string;
            description: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
}
