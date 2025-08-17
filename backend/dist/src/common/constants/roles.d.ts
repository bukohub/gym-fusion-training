export declare const Role: {
    readonly ADMIN: "ADMIN";
    readonly RECEPTIONIST: "RECEPTIONIST";
    readonly TRAINER: "TRAINER";
    readonly CLIENT: "CLIENT";
};
export type Role = typeof Role[keyof typeof Role];
export declare const MembershipStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly EXPIRED: "EXPIRED";
    readonly SUSPENDED: "SUSPENDED";
};
export type MembershipStatus = typeof MembershipStatus[keyof typeof MembershipStatus];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly CARD: "CARD";
    readonly TRANSFER: "TRANSFER";
};
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];
export declare const ClassStatus: {
    readonly SCHEDULED: "SCHEDULED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type ClassStatus = typeof ClassStatus[keyof typeof ClassStatus];
