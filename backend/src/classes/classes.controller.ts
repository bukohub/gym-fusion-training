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
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { BookClassDto } from './dto/book-class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class successfully created' })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'trainerId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('status') status?: string,
    @Query('trainerId') trainerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.classesService.findAll(page, limit, status, trainerId, startDate, endDate);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Get class statistics' })
  getStats() {
    return this.classesService.getClassStats();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming classes' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUpcoming(@Query('limit', new ParseIntPipe({ optional: true })) limit = 10) {
    return this.classesService.getUpcomingClasses(limit);
  }

  @Get('user/:userId/bookings')
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUserBookings(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.classesService.getUserBookings(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  @ApiResponse({ status: 200, description: 'Class found' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Update class' })
  @ApiResponse({ status: 200, description: 'Class successfully updated' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: 'Delete class' })
  @ApiResponse({ status: 200, description: 'Class successfully deleted' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.remove(id);
  }

  // Booking endpoints
  @Post('book')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.CLIENT)
  @ApiOperation({ summary: 'Book a class' })
  @ApiResponse({ status: 201, description: 'Class successfully booked' })
  bookClass(@Body() bookClassDto: BookClassDto) {
    return this.classesService.bookClass(bookClassDto);
  }

  @Delete('book/:userId/:classId')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.CLIENT)
  @ApiOperation({ summary: 'Cancel class booking' })
  @ApiResponse({ status: 200, description: 'Booking successfully cancelled' })
  cancelBooking(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('classId', ParseUUIDPipe) classId: string,
  ) {
    return this.classesService.cancelBooking(userId, classId);
  }

  @Patch('bookings/:bookingId/attendance')
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.TRAINER)
  @ApiOperation({ summary: 'Mark attendance for a booking' })
  @ApiQuery({ name: 'attended', required: true, type: Boolean })
  markAttendance(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Query('attended', ParseBoolPipe) attended: boolean,
  ) {
    return this.classesService.markAttendance(bookingId, attended);
  }
}