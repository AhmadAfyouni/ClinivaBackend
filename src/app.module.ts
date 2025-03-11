import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';

// Database & Configuration Modules
import {DatabaseModule} from "./modules/database/database.module";

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
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { MedicalRecordModule } from './modules/medicalrecord/medical-record.module';
import {JwtAuthGuard} from "./modules/auth/jwt-auth.guard";

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
    DepartmentModule,
    ClinicModule,
    EmployeeModule,
    DoctorModule,
    PatientModule,
    AppointmentModule,
    MedicalRecordModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Applies authentication globally
    },
  ],
})
export class AppModule {}
