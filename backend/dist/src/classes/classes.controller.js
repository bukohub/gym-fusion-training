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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const classes_service_1 = require("./classes.service");
const create_class_dto_1 = require("./dto/create-class.dto");
const update_class_dto_1 = require("./dto/update-class.dto");
const book_class_dto_1 = require("./dto/book-class.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_1 = require("../common/constants/roles");
let ClassesController = class ClassesController {
    constructor(classesService) {
        this.classesService = classesService;
    }
    create(createClassDto) {
        return this.classesService.create(createClassDto);
    }
    findAll(page = 1, limit = 10, status, trainerId, startDate, endDate) {
        return this.classesService.findAll(page, limit, status, trainerId, startDate, endDate);
    }
    getStats() {
        return this.classesService.getClassStats();
    }
    getUpcoming(limit = 10) {
        return this.classesService.getUpcomingClasses(limit);
    }
    getUserBookings(userId, page = 1, limit = 10) {
        return this.classesService.getUserBookings(userId, page, limit);
    }
    findOne(id) {
        return this.classesService.findOne(id);
    }
    update(id, updateClassDto) {
        return this.classesService.update(id, updateClassDto);
    }
    remove(id) {
        return this.classesService.remove(id);
    }
    bookClass(bookClassDto) {
        return this.classesService.bookClass(bookClassDto);
    }
    cancelBooking(userId, classId) {
        return this.classesService.cancelBooking(userId, classId);
    }
    markAttendance(bookingId, attended) {
        return this.classesService.markAttendance(bookingId, attended);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new class' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Class successfully created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all classes' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'trainerId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('trainerId')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Get class statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming classes' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getUpcoming", null);
__decorate([
    (0, common_1.Get)('user/:userId/bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bookings' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getUserBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get class by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Update class' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_class_dto_1.UpdateClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST),
    (0, swagger_1.ApiOperation)({ summary: 'Delete class' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('book'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Book a class' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Class successfully booked' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [book_class_dto_1.BookClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "bookClass", null);
__decorate([
    (0, common_1.Delete)('book/:userId/:classId'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel class booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking successfully cancelled' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('classId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:bookingId/attendance'),
    (0, roles_decorator_1.Roles)(roles_1.Role.ADMIN, roles_1.Role.RECEPTIONIST, roles_1.Role.TRAINER),
    (0, swagger_1.ApiOperation)({ summary: 'Mark attendance for a booking' }),
    (0, swagger_1.ApiQuery)({ name: 'attended', required: true, type: Boolean }),
    __param(0, (0, common_1.Param)('bookingId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('attended', common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "markAttendance", null);
exports.ClassesController = ClassesController = __decorate([
    (0, swagger_1.ApiTags)('Classes'),
    (0, common_1.Controller)('classes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [classes_service_1.ClassesService])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map