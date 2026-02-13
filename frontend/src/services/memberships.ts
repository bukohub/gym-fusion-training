import api from './api';
import { MembershipPlan, Membership, PaginatedResponse } from '../types';

export interface ValidationResponse {
  isValid: boolean;
  status: string;
  message: string;
  payment?: {
    id: string;
    amount: number;
    method: string;
    description?: string;
    paymentDate: string;
    daysSincePayment: number;
    daysUntilExpiry: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
      isActive: boolean;
      cedula?: string;
      photo?: string;
      holler?: string;
    };
    membership?: {
      id: string;
      plan: {
        name: string;
        duration: number;
        price: number;
      };
    };
    plan?: {
      name: string;
      duration: number;
      price: number;
    };
  };
  user?: {
    firstName: string;
    lastName: string;
    cedula?: string;
    photo?: string;
    holler?: string;
  };
}

export interface CreateMembershipPlanDto {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface UpdateMembershipPlanDto {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive?: boolean;
}

export interface CreateMembershipDto {
  userId: string;
  planId: string;
  startDate: string;
}

export interface UpdateMembershipDto {
  status?: string;
  endDate?: string;
}

export const membershipPlansApi = {
  // Membership Plans CRUD
  getAll: (page = 1, limit = 10, isActive?: boolean) =>
    api.get<{plans: MembershipPlan[], pagination: any}>('/memberships/plans', {
      params: { page, limit, isActive }
    }),

  getById: (id: string) =>
    api.get<MembershipPlan>(`/memberships/plans/${id}`),

  create: (data: CreateMembershipPlanDto) =>
    api.post<MembershipPlan>('/memberships/plans', data),

  update: (id: string, data: UpdateMembershipPlanDto) =>
    api.patch<MembershipPlan>(`/memberships/plans/${id}`, data),

  delete: (id: string) =>
    api.delete(`/memberships/plans/${id}`),
};

export const membershipsApi = {
  // Memberships CRUD
  getAll: (page = 1, limit = 10, status?: string, planId?: string, search?: string) =>
    api.get<PaginatedResponse<Membership>>('/memberships', {
      params: { page, limit, status, planId, search }
    }),

  getById: (id: string) =>
    api.get<Membership>(`/memberships/${id}`),

  create: (data: CreateMembershipDto) =>
    api.post<Membership>('/memberships', data),

  update: (id: string, data: UpdateMembershipDto) =>
    api.patch<Membership>(`/memberships/${id}`, data),

  delete: (id: string) =>
    api.delete(`/memberships/${id}`),

  suspend: (id: string) =>
    api.patch(`/memberships/${id}/suspend`),

  reactivate: (id: string) =>
    api.patch(`/memberships/${id}/activate`),

  renew: (id: string, planId: string) =>
    api.patch(`/memberships/${id}/renew`, { planId }),

  getExpiring: (days = 30) =>
    api.get<Membership[]>('/memberships/expiring', { params: { days } }),

  getUserMemberships: (userId: string) =>
    api.get<Membership[]>(`/memberships/user/${userId}`),

  getStats: () =>
    api.get('/memberships/stats'),

  // Payment-based validation (monthly gym payments)
  validate: (membershipId: string) =>
    api.get(`/memberships/validate/${membershipId}`),

  validateByUserId: (userId: string) =>
    api.get(`/memberships/validate/user/${userId}`),

  validateByCedula: (cedula: string) =>
    api.get<ValidationResponse>(`/memberships/validate/cedula/${cedula}`),

  validateByHoller: (holler: string) =>
    api.get<ValidationResponse>(`/memberships/validate/holler/${holler}`),

  // Payment status report
  getPaymentStatusReport: (page = 1, limit = 20, status: 'expired' | 'expiring_today' | 'expiring_soon' | 'current' | 'all' = 'all', expiringDays = 7) =>
    api.get(`/memberships/payment-status-report`, {
      params: { page, limit, status, expiringDays }
    }),
};