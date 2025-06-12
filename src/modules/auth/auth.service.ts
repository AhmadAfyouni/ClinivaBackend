import {
  Injectable,
  UnauthorizedException,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/schemas/employee.schema';
import { Role, RoleDocument } from '../role/schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiGetResponse } from 'src/common/utils/paginate';
import { PermissionsEnum } from 'src/config/permission.enum';
import {
  SystemLogService,
  CreateLogDto,
} from '../SystemLogAction/system-log.service'; // Added import
import { SystemLogAction } from '../SystemLogAction/log_schema'; // Added import
import { Request } from 'express'; // Added import for Request

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private readonly systemLogService: SystemLogService,
  ) {}

  /**
   * Validates an employee by email or username and password
   */
  async validateUser(
    identifier: string,
    password: string,
  ): Promise<Employee | null> {
    try {
      // Try to find employee by either email or name
      const employee =
        await this.employeeService.getUserByIdentifier(identifier);

      if (!employee.isActive) {
        throw new BadRequestException(
          'Your account is currently inactive. Please contact the system administrator for assistance.',
        );
      }

      if (employee.deleted) {
        throw new BadRequestException(
          'Your account has been deleted. Please contact the system administrator for assistance.',
        );
      }

      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        throw new BadRequestException(
          'Incorrect Username or password. Please try again',
        );
      }

      return employee;
    } catch (error) {
      // If user is not found or any other error occurs, throw invalid credentials
      console.log('Error', error.message);

      throw new BadRequestException(
        'Incorrect Username or password. Please try again',
      );
    }
  }

  /**
   * Authenticates user and returns access & refresh tokens + user data
   */
  async login(
    email: string,
    password: string,
    @Req() request?: Request, // Added optional request parameter
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
      user: any;
    };
  }> {
    console.log('start login', email);
    const user = await this.validateUser(email, password);

    if (!user || !user._id) {
      throw new BadRequestException('Invalid user');
    }

    // Get all permissions from user's roles
    const roles = await this.roleModel
      .find({ _id: { $in: user.roleIds } })
      .lean();
    const permissions = roles.flatMap((role) => role.permissions || []);
    const isAdmin = roles.some((r) => r.name?.toLowerCase() === 'admin');
    if (isAdmin && !permissions.includes(PermissionsEnum.ADMIN)) {
      permissions.push(PermissionsEnum.ADMIN);
    }
    const uniquePermissions = [...new Set(permissions)];

    // Create JWT payload
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      permissions: uniquePermissions,
      plan: user.plan,
      Owner: user.Owner,
      firstLogin: user.first_login,
      employeeType: user.employeeType,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '45m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Log the login action
    try {
      const logEntry: CreateLogDto = {
        userId: user._id.toString(),
        action: SystemLogAction.USER_LOGIN,
        ipAddress: request?.ip,
        userAgent: request?.headers?.['user-agent'],
        details: { loginMethod: 'email_password' },
      };
      await this.systemLogService.createLog(logEntry);
    } catch (logError) {
      console.error('Failed to create system log for user login:', logError);
    }

    return {
      success: true,
      message: 'Logged in successfully',
      data: {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          roles: roles.map((r) => r.name),
          permissions: uniquePermissions,
          plan: user.plan,
          Owner: user.Owner,
          firstLogin: user.first_login,
          employeeType: user.employeeType,
        },
      },
    };
  }

  /**
   * Generates a new access token from refresh token
   */
  async refreshToken(
    refreshToken: string,
  ): Promise<ApiGetResponse<{ accessToken: string }>> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const userResponse = await this.employeeService.getEmployeeById(
        payload.sub,
      );
      const user = userResponse.data;
      if (!user || Array.isArray(user))
        throw new UnauthorizedException('User not found');

      if (!user.isActive)
        throw new UnauthorizedException('User account is inactive.');
      if (user.deleted)
        throw new UnauthorizedException('User account has been deleted.');

      const newPayload = {
        sub: user._id.toString(),
        email: user.email,
      };

      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: this.jwtService.sign(newPayload, { expiresIn: '45m' }),
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
