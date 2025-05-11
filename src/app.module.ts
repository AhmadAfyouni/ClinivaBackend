import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Database & Configuration Modules
import { DatabaseModule } from './modules/database/database.module';

// Authentication & Authorization Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';

// Business Logic Modules
import { CompanyModule } from './modules/company/company.module';
import { ClinicCollectionModule } from './modules/cliniccollection/clinic-collection.module';
import { DepartmentModule } from './modules/department/department.module';
import { ClinicModule } from './modules/clinic/clinic.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { PatientModule } from './modules/patient/patient.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { MedicalRecordModule } from './modules/medicalrecord/medical-record.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { SpecializationModule } from './modules/specialization/specialization.module';
import { ServiceModule } from './modules/service/service.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SystemLogModule } from './modules/SystemLogAction/system-log.module';

// Security & Middleware

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env config available globally
    }),
    ScheduleModule.forRoot(), // Enables CRON Jobs if needed
    DatabaseModule, // Centralized database handling

    // Feature Modules
    AuthModule,
    UserModule,
    RoleModule,
    CompanyModule,
    ClinicCollectionModule,
    EmployeeModule,
    DepartmentModule,
    ClinicModule,

    PatientModule,
    AppointmentModule,
    MedicalRecordModule,
    SpecializationModule,
    ServiceModule,
    PermissionModule,
    SystemLogModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: () => {
        return new (class extends JwtAuthGuard {
          canActivate(context) {
            const request = context.switchToHttp().getRequest();
            // Allow /api/v1/docs to be accessed without authentication
            if (request.url.startsWith('/api/v1/docs')) return true;
            if (request.url.startsWith('/api/v1/auth')) return true;
            return super.canActivate(context); // Use the default JwtAuthGuard behavior
          }
        })();
      },
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
