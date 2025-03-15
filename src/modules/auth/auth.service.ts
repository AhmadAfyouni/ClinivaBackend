import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserService} from '../user/user.service';
import {User} from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Make sure _id exists
        if (!user._id) {
            throw new UnauthorizedException('User ID is missing');
        }

        const payload = {sub: user._id.toString(), email: user.email, roles: user.roleIds};

        return {
            accessToken: this.jwtService.sign(payload, {expiresIn: '30m'}), // Short-lived access token
            refreshToken: this.jwtService.sign(payload, {expiresIn: '7d'}),  // Long-lived refresh token
        };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            return {
                accessToken: this.jwtService.sign({
                    sub: payload.sub,
                    email: payload.email,
                    roles: payload.roles
                }, {expiresIn: '15m'}),
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
