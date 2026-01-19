import api from './api';
import { PaginatedResponse } from '../types';

export interface ValidationLog {
  id: string;
  userId: string | null;
  identifier: string;
  validationType: 'CEDULA' | 'HOLLER';
  success: boolean;
  reason: string | null;
  validatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string;
    photo: string | null;
  } | null;
}

export interface ValidationLogStats {
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
}

export interface ValidationTrend {
  date: string;
  total: number;
  successful: number;
  failed: number;
  cedula: number;
  holler: number;
}

export const validationLogsApi = {
  // Get all validation logs with filters
  getAll: (
    page = 1,
    limit = 10,
    validationType?: string,
    success?: boolean,
    startDate?: string,
    endDate?: string,
    userId?: string
  ) =>
    api.get<PaginatedResponse<ValidationLog>>('/validation-logs', {
      params: { page, limit, validationType, success, startDate, endDate, userId },
    }),

  // Get validation logs statistics
  getStats: () =>
    api.get<ValidationLogStats>('/validation-logs/stats'),

  // Get recent validation activity
  getRecentActivity: (limit = 10) =>
    api.get<ValidationLog[]>('/validation-logs/recent', {
      params: { limit },
    }),

  // Get validation trends
  getTrends: (days = 7) =>
    api.get<ValidationTrend[]>('/validation-logs/trends', {
      params: { days },
    }),
};