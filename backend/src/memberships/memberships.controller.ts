import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';

@ApiTags('Memberships')
@Controller('memberships')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  // Membership Plans endpoints
  @Post('plans')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Create a new membership plan' })
  @ApiResponse({ status: 201, description: 'Membership plan successfully created' })
  createPlan(@Body() createMembershipPlanDto: CreateMembershipPlanDto) {
    return this.membershipsService.createPlan(createMembershipPlanDto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all membership plans' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAllPlans(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.membershipsService.findAllPlans(page, limit, isActive);
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get membership plan by ID' })
  @ApiResponse({ status: 200, description: 'Membership plan found' })
  @ApiResponse({ status: 404, description: 'Membership plan not found' })
  findOnePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.findOnePlan(id);
  }

  @Patch('plans/:id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Update membership plan' })
  @ApiResponse({ status: 200, description: 'Membership plan successfully updated' })
  @ApiResponse({ status: 404, description: 'Membership plan not found' })
  updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ) {
    return this.membershipsService.updatePlan(id, updateMembershipPlanDto);
  }

  @Delete('plans/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete membership plan' })
  @ApiResponse({ status: 200, description: 'Membership plan successfully deleted' })
  @ApiResponse({ status: 404, description: 'Membership plan not found' })
  removePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.removePlan(id);
  }

  // Memberships endpoints
  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Create a new membership' })
  @ApiResponse({ status: 201, description: 'Membership successfully created' })
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipsService.createMembership(createMembershipDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Get all memberships' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: string,
  ) {
    return this.membershipsService.findAllMemberships(page, limit, status, userId);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get membership statistics' })
  getStats() {
    return this.membershipsService.getMembershipStats();
  }

  @Get('payment-status-report')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get payment status report for all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['expired', 'expiring_today', 'expiring_soon', 'current', 'all'] })
  @ApiQuery({ name: 'expiringDays', required: false, type: Number, description: 'Days ahead to consider as expiring soon (default: 7)' })
  getPaymentStatusReport(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('status') status: 'expired' | 'expiring_today' | 'expiring_soon' | 'current' | 'all' = 'all',
    @Query('expiringDays', new ParseIntPipe({ optional: true })) expiringDays = 7,
  ) {
    return this.membershipsService.getPaymentStatusReport(page, limit, status, expiringDays);
  }

  @Get('expiring')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get expiring memberships' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getExpiring(@Query('days', new ParseIntPipe({ optional: true })) days = 7) {
    return this.membershipsService.getExpiringMemberships(days);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Get membership by ID' })
  @ApiResponse({ status: 200, description: 'Membership found' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.findOneMembership(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Update membership' })
  @ApiResponse({ status: 200, description: 'Membership successfully updated' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateData: any) {
    return this.membershipsService.updateMembership(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete membership' })
  @ApiResponse({ status: 200, description: 'Membership successfully deleted' })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.removeMembership(id);
  }

  @Patch(':id/renew')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Renew membership' })
  renew(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.renewMembership(id);
  }

  @Patch(':id/suspend')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Suspend membership' })
  suspend(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.suspendMembership(id);
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Activate membership' })
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.activateMembership(id);
  }

  @Get('validate/:id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Validate membership by membership ID' })
  @ApiResponse({ status: 200, description: 'Membership validation result' })
  validateMembership(@Param('id', ParseUUIDPipe) id: string) {
    return this.membershipsService.validateMembership(id);
  }

  @Get('validate/user/:userId')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Validate membership by user ID' })
  @ApiResponse({ status: 200, description: 'Membership validation result' })
  validateMembershipByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.membershipsService.validateMembershipByUserId(userId);
  }

  @Get('validate/cedula/:cedula')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Validate membership by cedula (Colombian ID)' })
  @ApiResponse({ status: 200, description: 'Membership validation result' })
  validateMembershipByCedula(@Param('cedula') cedula: string) {
    return this.membershipsService.validateMembershipByCedula(cedula);
  }

  @Get('validate/holler/:holler')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Validate membership by digital holler ID' })
  @ApiResponse({ status: 200, description: 'Membership validation result' })
  validateMembershipByHoller(@Param('holler') holler: string) {
    return this.membershipsService.validateMembershipByHoller(holler);
  }
}