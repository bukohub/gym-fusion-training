import api from './api';
import { Payment, PaginatedResponse } from '../types';

export interface CreatePaymentDto {
  userId: string;
  membershipId?: string;
  amount: number;
  method: string;
  description?: string;
}

export interface UpdatePaymentDto {
  status?: string;
  transactionId?: string;
  description?: string;
}

export const paymentsApi = {
  // Payments CRUD
  getAll: (page = 1, limit = 10, status?: string, method?: string, userId?: string, startDate?: string, endDate?: string) =>
    api.get<PaginatedResponse<Payment>>('/payments', {
      params: { page, limit, status, method, userId, startDate, endDate }
    }),

  getById: (id: string) =>
    api.get<Payment>(`/payments/${id}`),

  create: (data: CreatePaymentDto) =>
    api.post<Payment>('/payments', data),

  update: (id: string, data: UpdatePaymentDto) =>
    api.patch<Payment>(`/payments/${id}`, data),

  delete: (id: string) =>
    api.delete(`/payments/${id}`),

  process: (id: string) =>
    api.patch(`/payments/${id}/process`),

  refund: (id: string, reason?: string) =>
    api.patch(`/payments/${id}/refund`, { reason }),

  getUserPayments: (userId: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<Payment>>(`/payments/user/${userId}`, {
      params: { page, limit }
    }),

  getStats: () =>
    api.get('/payments/stats'),

  getRevenue: (startDate: string, endDate: string) =>
    api.get('/payments/revenue', { params: { startDate, endDate } }),
};