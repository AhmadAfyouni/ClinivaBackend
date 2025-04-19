import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Role,RoleSchema } from '../role/schemas/role.schema';
import { RoleModule } from '../role/role.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Role.name, schema: Role },]),forwardRef(()=>RoleModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // في حال احتجنا لاستخدام الخدمة في أماكن أخرى
})
export class UserModule {
}
