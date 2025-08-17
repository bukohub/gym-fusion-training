import api from './api';
import { Class, ClassBooking, PaginatedResponse } from '../types';

export interface CreateClassDto {
  name: string;
  description?: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export interface UpdateClassDto {
  name?: string;
  description?: string;
  trainerId?: string;
  startTime?: string;
  endTime?: string;
  maxCapacity?: number;
  status?: string;
}

export interface BookClassDto {
  userId: string;
  classId: string;
}

export const classesApi = {
  // Classes CRUD
  getAll: (page = 1, limit = 10, status?: string, trainerId?: string, startDate?: string, endDate?: string) =>
    api.get<PaginatedResponse<Class>>('/classes', {
      params: { page, limit, status, trainerId, startDate, endDate }
    }),

  getById: (id: string) =>
    api.get<Class>(`/classes/${id}`),

  create: (data: CreateClassDto) =>
    api.post<Class>('/classes', data),

  update: (id: string, data: UpdateClassDto) =>
    api.patch<Class>(`/classes/${id}`, data),

  delete: (id: string) =>
    api.delete(`/classes/${id}`),

  // Class Booking operations
  bookClass: (data: BookClassDto) =>
    api.post<ClassBooking>('/classes/book', data),

  cancelBooking: (userId: string, classId: string) =>
    api.delete(`/classes/book/${userId}/${classId}`),

  markAttendance: (bookingId: string, attended: boolean) =>
    api.patch(`/classes/attendance/${bookingId}`, { attended }),

  // Additional endpoints
  getUpcoming: (limit = 10) =>
    api.get<Class[]>('/classes/upcoming', { params: { limit } }),

  getUserBookings: (userId: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<ClassBooking>>(`/classes/bookings/${userId}`, {
      params: { page, limit }
    }),

  getStats: () =>
    api.get('/classes/stats'),
};