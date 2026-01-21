import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Products CRUD
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        isActive: createProductDto.isActive ?? true,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    category?: string,
    isActive?: boolean,
    lowStock?: boolean,
    search?: string,
  ) {
    const offset = (page - 1) * limit;
    
    const where: any = {};
    
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;
    // Low stock filtering will be done after query since we need to compare with minStock field
    // This will be handled in the return mapping
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

    // Filter by low stock if requested
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

  async findOne(id: string) {
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
      throw new NotFoundException('Product not found');
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' = 'add') {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const newStock = operation === 'add' 
      ? product.stock + quantity 
      : product.stock - quantity;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
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

  // Sales CRUD
  async createSale(createSaleDto: CreateSaleDto) {
    const { productId, quantity, soldBy } = createSaleDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * quantity;

    // Create sale and update stock in a transaction
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

  async findAllSales(
    page = 1,
    limit = 10,
    productId?: string,
    soldBy?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const offset = (page - 1) * limit;
    
    const where: any = {};
    
    if (productId) where.productId = productId;
    if (soldBy) where.soldBy = soldBy;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
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

  async findOneSale(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async getProductStats() {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalSales,
      lowStockCount,
    ] = await Promise.all([
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

    const topProducts = await Promise.all(
      topSellingProducts.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, price: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
          salesCount: item._count.productId,
        };
      })
    );

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

  async getSalesReport(year: number, month?: number) {
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
}