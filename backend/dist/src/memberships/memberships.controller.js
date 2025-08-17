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
exports.MembershipsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const memberships_service_1 = require("./memberships.service");
const create_membership_plan_dto_1 = require("./dto/create-membership-plan.dto");
const update_membership_plan_dto_1 = require("./dto/update-membership-plan.dto");
const create_membership_dto_1 = require("./dto/create-membership.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_1 = require("../common/constants/roles");
let MembershipsController = class MembershipsController {
    constructor(membershipsService) {
        this.membershipsService = membershipsService;
    }
    createPlan(createMembershipPlanDto) {
        return this.membershipsService.createPlan(createMembershipPlanDto);
    }
    findAllPlans(page = 1, limit = 10, isActive) {
        return this.membershipsService.findAllPlans(page, limit, isActive);
    }
    findOnePlan(id) {
        return this.membershipsService.findOnePlan(id);
    }
    updatePlan(id, updateMembershipPlanDto) {
        return this.membershipsService.updatePlan(id, updateMembershipPlanDto);
    }
    removePlan(id) {
        return this.membershipsService.removePlan(id);
    }
    create(createMembershipDto) {
        return this.membershipsService.createMembership(createMembershipDto);
    }
    findAll(page = 1, limit = 10, status, userId) {
        return this.membershipsService.findAllMemberships(page, limit, status, userId);
    }
    getStats() {
        return this.membershipsService.getMembershipStats();
    }
    getExpiring(days = 7) {
        return this.membershipsService.getExpiringMemberships(days);
    }
    findOne(id) {
        return this.membershipsService.findOneMembership(id);
    }
    update(id, updateData) {
        return this.membershipsService.updateMembership(id, updateData);
    }
    remove(id) {
        return this.membershipsService.removeMembership(id);
    }
    renew(id) {
        return this.membershipsService.renewMembership(id);
    }
    suspend(id) {
        return this.membershipsService.suspendMembership(id);
    }
    activate(id) {
        return this.membershipsService.activateMembership(id);
    }
    validateMembership(id) {
        return this.membershipsService.validateMembership(id);
    }
    validateMembershipByUser(userId) {
        return this.membershipsService.validateMembershipByUserId(userId);
    }
    validateMembershipByCedula(cedula) {
        return this.membershipsService.validateMembershipByCedula(cedula);
    }
    validateMembershipByHoller(holler) {
        return this.membershipsService.validateMembershipByHoller(holler);
    }
};
exports.MembershipsController = MembershipsController;
__decorate([
    (0, common_1.Post)('plans'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new membership plan' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Membership plan successfully created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_membership_plan_dto_1.CreateMembershipPlanDto]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all membership plans' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Boolean]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "findAllPlans", null);
__decorate([
    (0, common_1.Get)('plans/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get membership plan by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership plan found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership plan not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "findOnePlan", null);
__decorate([
    (0, common_1.Patch)('plans/:id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Update membership plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership plan successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership plan not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_membership_plan_dto_1.UpdateMembershipPlanDto]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete membership plan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership plan successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership plan not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "removePlan", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new membership' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Membership successfully created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_membership_dto_1.CreateMembershipDto]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all memberships' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get membership statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Get expiring memberships' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, type: Number }),
    __param(0, (0, common_1.Query)('days', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "getExpiring", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Get membership by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Update membership' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete membership' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Membership not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/renew'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Renew membership' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "renew", null);
__decorate([
    (0, common_1.Patch)(':id/suspend'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend membership' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "suspend", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Activate membership' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "activate", null);
__decorate([
    (0, common_1.Get)('validate/:id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Validate membership by membership ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership validation result' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "validateMembership", null);
__decorate([
    (0, common_1.Get)('validate/user/:userId'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Validate membership by user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership validation result' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "validateMembershipByUser", null);
__decorate([
    (0, common_1.Get)('validate/cedula/:cedula'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Validate membership by cedula (Colombian ID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership validation result' }),
    __param(0, (0, common_1.Param)('cedula')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "validateMembershipByCedula", null);
__decorate([
    (0, common_1.Get)('validate/holler/:holler'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Validate membership by digital holler ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Membership validation result' }),
    __param(0, (0, common_1.Param)('holler')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipsController.prototype, "validateMembershipByHoller", null);
exports.MembershipsController = MembershipsController = __decorate([
    (0, swagger_1.ApiTags)('Memberships'),
    (0, common_1.Controller)('memberships'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [memberships_service_1.MembershipsService])
], MembershipsController);
//# sourceMappingURL=memberships.controller.js.map