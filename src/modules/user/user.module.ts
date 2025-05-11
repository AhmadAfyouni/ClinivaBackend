import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfileController } from './profile.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Role, RoleSchema } from '../role/schemas/role.schema';
import { RoleModule } from '../role/role.module';
import { SystemLogModule } from '../SystemLogAction/system-log.module'; // Adjust path if necessary
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    forwardRef(() => RoleModule),
    SystemLogModule, // Add SystemLogModule here
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService],
  exports: [UserService], // في حال احتجنا لاستخدام الخدمة في أماكن أخرى
})
export class UserModule {}
