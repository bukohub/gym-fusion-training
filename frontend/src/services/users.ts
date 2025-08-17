import api from './api';
import { User, PaginatedResponse } from '../types';

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export const usersApi = {
  // Users CRUD
  getAll: (page = 1, limit = 10, role?: string, isActive?: boolean, search?: string) =>
    api.get<PaginatedResponse<User>>('/users', {
      params: { page, limit, role, isActive, search }
    }),

  getById: (id: string) =>
    api.get<User>(`/users/${id}`),

  create: (data: CreateUserDto) =>
    api.post<User>('/users', data),

  update: (id: string, data: UpdateUserDto) =>
    api.patch<User>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),

  deactivate: (id: string) =>
    api.patch(`/users/${id}/deactivate`),

  activate: (id: string) =>
    api.patch(`/users/${id}/activate`),

  resetPassword: (id: string) =>
    api.patch(`/users/${id}/reset-password`),

  getProfile: () =>
    api.get<User>('/users/profile'),

  updateProfile: (data: Partial<UpdateUserDto>) =>
    api.patch<User>('/users/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/users/change-password', { currentPassword, newPassword }),

  getTrainers: () =>
    api.get<User[]>('/users/trainers'),

  getClients: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<User>>('/users/clients', {
      params: { page, limit }
    }),

  getStats: () =>
    api.get('/users/stats'),
};