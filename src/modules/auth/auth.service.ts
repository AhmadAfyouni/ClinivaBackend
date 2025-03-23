import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { Role, RoleDocument } from '../role/schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) {}

    /**
     * Validates a user by email and password
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

        return user;
    }

    /**
     * Authenticates user and returns access & refresh tokens + user data
     */
    async login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }> {
        const user = await this.validateUser(email, password);

        if (!user || !user._id) {
            throw new UnauthorizedException('Invalid user');
        }

        // Get all permissions from user's roles
        const roles = await this.roleModel.find({ _id: { $in: user.roleIds } }).lean();
        const permissions = roles.flatMap(role => role.permissions || []);
        const uniquePermissions = [...new Set(permissions)];

        // Create JWT payload
        const payload = {
            sub: user._id.toString(),
            email: user.email,
        };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return {
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: roles.map(r => r.name),
                permissions: uniquePermissions,
            },
        };
    }

    /**
     * Generates a new access token from refresh token
     */
    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken);

            const userResponse  = await this.userService.getUserById(payload.sub);
            const user = userResponse.data; 
            if (!user|| Array.isArray(user)) throw new UnauthorizedException('User not found');
               
            const newPayload = {
                sub: user._id.toString(),
                email: user.email,

            };

            return {
                accessToken: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
