import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('revenue')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Revenue report retrieved successfully' })
  getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getRevenueReport(startDate, endDate);
  }

  @Get('memberships')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get membership report' })
  @ApiResponse({ status: 200, description: 'Membership report retrieved successfully' })
  getMembershipReport() {
    return this.reportsService.getMembershipReport();
  }

  @Get('classes')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Get class report' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Class report retrieved successfully' })
  getClassReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getClassReport(startDate, endDate);
  }

  @Get('users')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get user report' })
  @ApiResponse({ status: 200, description: 'User report retrieved successfully' })
  getUserReport() {
    return this.reportsService.getUserReport();
  }

  @Get('financial/:year')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get financial summary for a year' })
  @ApiResponse({ status: 200, description: 'Financial summary retrieved successfully' })
  getFinancialSummary(@Query('year', ParseIntPipe) year: number) {
    return this.reportsService.getFinancialSummary(year);
  }
}