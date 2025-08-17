"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_1 = require("../common/constants/roles");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboardStats() {
        return this.reportsService.getDashboardStats();
    }
    getRevenueReport(startDate, endDate) {
        return this.reportsService.getRevenueReport(startDate, endDate);
    }
    getMembershipReport() {
        return this.reportsService.getMembershipReport();
    }
    getClassReport(startDate, endDate) {
        return this.reportsService.getClassReport(startDate, endDate);
    }
    getUserReport() {
        return this.reportsService.getUserReport();
    }
    getFinancialSummary(year) {
        return this.reportsService.getFinancialSummary(year);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard stats retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get revenue report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String, example: '2024-01-01' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String, example: '2024-12-31' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue report retrieved successfully' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getRevenueReport", null);
__decorate([
    (0, common_1.Get)('memberships'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get membership report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getMembershipReport", null);
__decorate([
    (0, common_1.Get)('classes'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Get class report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class report retrieved successfully' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getClassReport", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get user report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User report retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getUserReport", null);
__decorate([
    (0, common_1.Get)('financial/:year'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial summary for a year' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial summary retrieved successfully' }),
    __param(0, (0, common_1.Query)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancialSummary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map