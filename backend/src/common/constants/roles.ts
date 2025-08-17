export const Role = {
  ADMIN: 'ADMIN',
  RECEPTIONIST: 'RECEPTIONIST',
  TRAINER: 'TRAINER',
  CLIENT: 'CLIENT',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const MembershipStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type MembershipStatus = typeof MembershipStatus[keyof typeof MembershipStatus];

export const PaymentMethod = {
  CASH: 'CASH',
  CARD: 'CARD',
  TRANSFER: 'TRANSFER',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const ClassStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type ClassStatus = typeof ClassStatus[keyof typeof ClassStatus];