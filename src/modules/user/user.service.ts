import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {User, UserDocument} from './schemas/user.schema';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds); // ✅ تشفير كلمة المرور

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword, 
        });
        return newUser.save();
    }


    async getAllUsers(paginationDto: PaginationAndFilterDto, filters: any) {
        let { page, limit, allData, sortBy, order } = paginationDto;

        // Convert page & limit to numbers
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const sortField: string = sortBy ?? 'createdAt';
        const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
        return paginate(this.userModel,[], page, limit, allData, filters, sort);
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email}).exec();
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).exec();
        if (!updatedUser) throw new NotFoundException('User not found');
        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) throw new NotFoundException('User not found');
    }

    async getUserByClinicCollectionId(clinicCollectionId: string): Promise<User | null> {
        return this.userModel
          .findOne({ clinicCollectionId })
           
          .exec();
      }
}
