import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembershipsModule } from './memberships/memberships.module';
import { PaymentsModule } from './payments/payments.module';
import { ClassesModule } from './classes/classes.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';
import { ValidationLogsModule } from './validation-logs/validation-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MembershipsModule,
    PaymentsModule,
    ClassesModule,
    ProductsModule,
    ReportsModule,
    UploadsModule,
    ValidationLogsModule,
  ],
})
export class AppModule {}