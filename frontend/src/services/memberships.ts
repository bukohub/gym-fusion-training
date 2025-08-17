import api from './api';
import { MembershipPlan, Membership, PaginatedResponse } from '../types';

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
    api.get<PaginatedResponse<MembershipPlan>>('/memberships/plans', {
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

  // Membership validation
  validate: (membershipId: string) =>
    api.get(`/memberships/validate/${membershipId}`),

  validateByUserId: (userId: string) =>
    api.get(`/memberships/validate/user/${userId}`),

  validateByCedula: (cedula: string) =>
    api.get(`/memberships/validate/cedula/${cedula}`),

  validateByHoller: (holler: string) =>
    api.get(`/memberships/validate/holler/${holler}`),
};