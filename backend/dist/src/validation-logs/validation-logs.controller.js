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
exports.ValidationLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const validation_logs_service_1 = require("./validation-logs.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_1 = require("../common/constants/roles");
let ValidationLogsController = class ValidationLogsController {
    constructor(validationLogsService) {
        this.validationLogsService = validationLogsService;
    }
    findAll(page = 1, limit = 10, validationType, success, startDate, endDate, userId) {
        return this.validationLogsService.findAll(page, limit, validationType, success, startDate, endDate, userId);
    }
    getStats() {
        return this.validationLogsService.getStats();
    }
    getRecentActivity(limit = 10) {
        return this.validationLogsService.getRecentActivity(limit);
    }
    getValidationTrends(days = 7) {
        return this.validationLogsService.getValidationTrends(days);
    }
};
exports.ValidationLogsController = ValidationLogsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get all validation logs with pagination and filters' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'validationType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'success', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('validationType')),
    __param(3, (0, common_1.Query)('success', new common_1.ParseBoolPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Boolean, String, String, String]),
    __metadata("design:returntype", void 0)
], ValidationLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get validation logs statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation logs statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ValidationLogsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent validation activity' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ValidationLogsController.prototype, "getRecentActivity", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get validation trends over time' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number }),
    __param(0, (0, common_1.Query)('days', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ValidationLogsController.prototype, "getValidationTrends", null);
exports.ValidationLogsController = ValidationLogsController = __decorate([
    (0, swagger_1.ApiTags)('Validation Logs'),
    (0, common_1.Controller)('validation-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [validation_logs_service_1.ValidationLogsService])
], ValidationLogsController);
//# sourceMappingURL=validation-logs.controller.js.map