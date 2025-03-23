import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {UserModule} from '../user/user.module';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from '../user/schemas/user.schema';
import {JwtStrategy} from "./jwtstrategy";
import { RoleModule } from '../role/role.module';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'superSecretKey', // Keep it in .env file
            signOptions: {expiresIn: '15m'}, // Access token expiration
        }),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        UserModule, // Import the User module
        RoleModule, // Import the Role module
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy], // Services
    exports: [AuthService], // Allows other modules to use AuthService
})
export class AuthModule {
}
