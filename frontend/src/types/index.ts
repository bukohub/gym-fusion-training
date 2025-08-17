export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cedula: string;
  phone?: string;
  role: Role;
  avatar?: string;
  photo?: string;
  holler?: string;
  isActive: boolean;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
  TRAINER = 'TRAINER',
  CLIENT = 'CLIENT',
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ClassStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
  plan?: MembershipPlan;
}

export interface Payment {
  id: string;
  userId: string;
  membershipId?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  description?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  membership?: Membership;
}

export interface Class {
  id: string;
  name: string;
  description?: string;
  trainerId: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  status: ClassStatus;
  createdAt: string;
  updatedAt: string;
  trainer?: User;
  bookings?: ClassBooking[];
}

export interface ClassBooking {
  id: string;
  userId: string;
  classId: string;
  bookedAt: string;
  attended: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  class?: Class;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  soldBy: string;
  createdAt: string;
  product?: Product;
}

export interface AccessLog {
  id: string;
  userId: string;
  method: string;
  timestamp: string;
  success: boolean;
  user?: User;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cedula: string;
  phone?: string;
  role?: Role;
  photo?: string;
  holler?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeMembers: number;
  monthlyRevenue: number;
  classesThisWeek: number;
  expiringMemberships: number;
  lowStockProducts: number;
}