import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ValidationLogsService } from './validation-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';

@ApiTags('Validation Logs')
@Controller('validation-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ValidationLogsController {
  constructor(private readonly validationLogsService: ValidationLogsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get all validation logs with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'validationType', required: false, type: String })
  @ApiQuery({ name: 'success', required: false, type: Boolean })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('validationType') validationType?: string,
    @Query('success', new ParseBoolPipe({ optional: true })) success?: boolean,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
  ) {
    return this.validationLogsService.findAll(
      page,
      limit,
      validationType,
      success,
      startDate,
      endDate,
      userId
    );
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get validation logs statistics' })
  @ApiResponse({ status: 200, description: 'Validation logs statistics' })
  getStats() {
    return this.validationLogsService.getStats();
  }

  @Get('recent')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get recent validation activity' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getRecentActivity(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.validationLogsService.getRecentActivity(limit);
  }

  @Get('trends')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Get validation trends over time' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  getValidationTrends(
    @Query('days', new ParseIntPipe({ optional: true })) days = 7,
  ) {
    return this.validationLogsService.getValidationTrends(days);
  }
}