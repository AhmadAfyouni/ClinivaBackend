import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwtstrategy';
import { RoleModule } from '../role/role.module';
import { SystemLogModule } from '../SystemLogAction/system-log.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey', // Keep it in .env file
      signOptions: { expiresIn: '15m' }, // Access token expiration
    }),
    RoleModule,
    SystemLogModule,
    EmployeeModule // Import EmployeeModule to use EmployeeService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Services
  exports: [AuthService], // Allows other modules to use AuthService
})
export class AuthModule {}
