"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassStatus = exports.PaymentStatus = exports.PaymentMethod = exports.MembershipStatus = exports.Role = void 0;
exports.Role = {
    ADMIN: 'ADMIN',
    RECEPTIONIST: 'RECEPTIONIST',
    TRAINER: 'TRAINER',
    CLIENT: 'CLIENT',
};
exports.MembershipStatus = {
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    SUSPENDED: 'SUSPENDED',
};
exports.PaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    TRANSFER: 'TRANSFER',
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};
exports.ClassStatus = {
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};
//# sourceMappingURL=roles.js.map