import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {User, UserDocument} from './schemas/user.schema';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { ApiResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';



@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async createUser(createUserDto: CreateUserDto):Promise<ApiResponse <User>>{
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds); // ✅ تشفير كلمة المرور

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword, 
        });
        const savedUser = await newUser.save();

        return {
            success:true,
            message: 'Department created successfully',
            data: savedUser};
    
    }


    async getAllUsers(paginationDto: PaginationAndFilterDto, filters: any) {
        let { page, limit, allData, sortBy, order } = paginationDto;

        // Convert page & limit to numbers
        page = Number(page) || 1;
        limit = Number(limit) || 10;

        const sortField: string = sortBy ?? 'createdAt';
        const sort: Record<string, number> = { [sortField]: order === 'asc' ? 1 : -1 };
        return paginate(this.userModel,['roleIds',  'companyId', 'clinicCollectionId',   'departmentId', 
              'clinics',  ], page, limit, allData, filters, sort);
    }

    async getUserById(id: string):Promise<ApiResponse <User>> {
        const user = await this.userModel.findById(id).populate(['roleIds',  'companyId', 'clinicCollectionId',   'departmentId', 
            'clinics',  ]).exec();
            

        if (!user) throw new NotFoundException('User not found');
      
        return {
            success:true,
            message: 'user retrieved successfully',
            data:user} ;
        
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email}).exec();
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponse <User>>  {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).exec();
        if (!updatedUser) throw new NotFoundException('User not found');
         
        return {
            success:true,
            message: 'User update successfully',
            data:updatedUser,};
        
    }

    async deleteUser(id: string): Promise <ApiResponse <User>> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) throw new NotFoundException('User not found');
        return {
            success:true,
            message: 'user remove successfully',
        }
    }

    async getUserByClinicCollectionId(clinicCollectionId: string): Promise<User | null> {
        return this.userModel
          .findOne({ clinicCollectionId })
           
          .exec();
      }
    // Change password (requires current password)
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<string>> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new UnauthorizedException('Current password is incorrect');

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
        return {
            success:true,
            message: 'Password changed successfully'
        }
    }

    // Reset password (admin or token-based)
    async resetPassword(userId: string, newPassword: string): Promise<ApiResponse<string>> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
        return {
            success:true,
            message: 'Password reset successfully',
        }
    }
}
