import { Module } from '@nestjs/common';
import { ValidationLogsService } from './validation-logs.service';
import { ValidationLogsController } from './validation-logs.controller';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ValidationLogsController],
  providers: [ValidationLogsService],
  exports: [ValidationLogsService],
})
export class ValidationLogsModule {}