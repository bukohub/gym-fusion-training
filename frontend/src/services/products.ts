import api from './api';
import { Product, Sale, PaginatedResponse } from '../types';

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  minStock?: number;
  category?: string;
  isActive?: boolean;
}

export interface CreateSaleDto {
  productId: string;
  quantity: number;
  soldBy: string;
}

export const productsApi = {
  // Products CRUD
  getAll: (page = 1, limit = 10, category?: string, isActive?: boolean, lowStock?: boolean, search?: string) =>
    api.get<PaginatedResponse<Product>>('/products', {
      params: { page, limit, category, isActive, lowStock, search }
    }),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`),

  create: (data: CreateProductDto) =>
    api.post<Product>('/products', data),

  update: (id: string, data: UpdateProductDto) =>
    api.patch<Product>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete(`/products/${id}`),

  updateStock: (id: string, quantity: number, operation: 'add' | 'subtract' = 'add') =>
    api.patch(`/products/${id}/stock`, { quantity, operation }),

  getLowStock: () =>
    api.get<Product[]>('/products/low-stock'),

  getCategories: () =>
    api.get('/products/categories'),

  getStats: () =>
    api.get('/products/stats'),
};

export const salesApi = {
  // Sales CRUD
  getAll: (page = 1, limit = 10, productId?: string, soldBy?: string, startDate?: string, endDate?: string) =>
    api.get<PaginatedResponse<Sale>>('/products/sales', {
      params: { page, limit, productId, soldBy, startDate, endDate }
    }),

  getById: (id: string) =>
    api.get<Sale>(`/products/sales/${id}`),

  create: (data: CreateSaleDto) =>
    api.post<Sale>('/products/sales', data),

  getReport: (year: number, month?: number) =>
    api.get('/products/sales/report', { params: { year, month } }),
};