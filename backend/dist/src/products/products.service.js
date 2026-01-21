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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                isActive: createProductDto.isActive ?? true,
            },
        });
    }
    async findAll(page = 1, limit = 10, category, isActive, lowStock, search) {
        const offset = (page - 1) * limit;
        const where = {};
        if (category)
            where.category = category;
        if (isActive !== undefined)
            where.isActive = isActive;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    sales: {
                        take: 5,
                        orderBy: { createdAt: 'desc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        const mappedProducts = products.map(product => ({
            ...product,
            isLowStock: product.stock <= product.minStock,
            totalSales: product.sales.reduce((sum, sale) => sum + sale.quantity, 0),
        }));
        const filteredProducts = lowStock
            ? mappedProducts.filter(product => product.isLowStock)
            : mappedProducts;
        return {
            products: filteredProducts,
            pagination: {
                total: lowStock ? filteredProducts.length : total,
                page,
                limit,
                totalPages: Math.ceil((lowStock ? filteredProducts.length : total) / limit),
            },
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                sales: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const totalSales = product.sales.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalRevenue = product.sales.reduce((sum, sale) => sum + Number(sale.totalPrice), 0);
        return {
            ...product,
            isLowStock: product.stock <= product.minStock,
            totalSales,
            totalRevenue,
        };
    }
    async update(id, updateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
    async updateStock(id, quantity, operation = 'add') {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const newStock = operation === 'add'
            ? product.stock + quantity
            : product.stock - quantity;
        if (newStock < 0) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        return this.prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });
    }
    async getLowStockProducts() {
        const products = await this.prisma.product.findMany({
            where: {
                isActive: true,
            },
        });
        return products.filter(product => product.stock <= product.minStock);
    }
    async getCategories() {
        const categories = await this.prisma.product.groupBy({
            by: ['category'],
            where: { isActive: true },
            _count: { category: true },
        });
        return categories.map(cat => ({
            name: cat.category,
            count: cat._count.category,
        }));
    }
    async createSale(createSaleDto) {
        const { productId, quantity, soldBy } = createSaleDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException('Product is not active');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const unitPrice = Number(product.price);
        const totalPrice = unitPrice * quantity;
        const result = await this.prisma.$transaction([
            this.prisma.sale.create({
                data: {
                    productId,
                    quantity,
                    unitPrice,
                    totalPrice,
                    soldBy,
                },
                include: {
                    product: true,
                },
            }),
            this.prisma.product.update({
                where: { id: productId },
                data: { stock: product.stock - quantity },
            }),
        ]);
        return result[0];
    }
    async findAllSales(page = 1, limit = 10, productId, soldBy, startDate, endDate) {
        const offset = (page - 1) * limit;
        const where = {};
        if (productId)
            where.productId = productId;
        if (soldBy)
            where.soldBy = soldBy;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [sales, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                include: {
                    product: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            }),
            this.prisma.sale.count({ where }),
        ]);
        return {
            sales,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneSale(id) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                product: true,
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        return sale;
    }
    async getProductStats() {
        const [totalProducts, activeProducts, totalCategories, totalSales, lowStockCount,] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.product.groupBy({ by: ['category'] }).then(cats => cats.length),
            this.prisma.sale.count(),
            this.getLowStockProducts().then(products => products.length),
        ]);
        const totalRevenue = await this.prisma.sale.aggregate({
            _sum: { totalPrice: true },
        });
        const topSellingProducts = await this.prisma.sale.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            _count: { productId: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5,
        });
        const topProducts = await Promise.all(topSellingProducts.map(async (item) => {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
                select: { id: true, name: true, price: true },
            });
            return {
                ...product,
                totalSold: item._sum.quantity,
                salesCount: item._count.productId,
            };
        }));
        return {
            totalProducts,
            activeProducts,
            inactiveProducts: totalProducts - activeProducts,
            totalCategories,
            totalSales,
            lowStockCount,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            topSellingProducts: topProducts,
        };
    }
    async getSalesReport(year, month) {
        const startDate = month
            ? new Date(year, month - 1, 1)
            : new Date(year, 0, 1);
        const endDate = month
            ? new Date(year, month, 0, 23, 59, 59)
            : new Date(year + 1, 0, 0, 23, 59, 59);
        const sales = await this.prisma.sale.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                product: true,
            },
        });
        const report = sales.reduce((acc, sale) => {
            const date = sale.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = {
                    date,
                    sales: 0,
                    revenue: 0,
                    items: [],
                };
            }
            acc[date].sales += sale.quantity;
            acc[date].revenue += sale.totalPrice;
            acc[date].items.push({
                product: sale.product.name,
                quantity: sale.quantity,
                revenue: sale.totalPrice,
            });
            return acc;
        }, {});
        return Object.values(report);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map