import api from './api';
import { DashboardStats } from '../types';

export const reportsApi = {
  getDashboardStats: () =>
    api.get<DashboardStats>('/reports/dashboard'),

  getRevenueReport: (startDate: string, endDate: string) =>
    api.get('/reports/revenue', { params: { startDate, endDate } }),

  getMembershipReport: () =>
    api.get('/reports/memberships'),

  getClassReport: (startDate?: string, endDate?: string) =>
    api.get('/reports/classes', { params: { startDate, endDate } }),

  getUserReport: () =>
    api.get('/reports/users'),

  getFinancialSummary: (year: number) =>
    api.get(`/reports/financial/${year}`),
};