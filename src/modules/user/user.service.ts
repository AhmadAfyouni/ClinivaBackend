import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiGetResponse, paginate } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { RoleDocument,Role } from '../role/schemas/role.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  @InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}


  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ApiGetResponse<User>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    ); // ✅ تشفير كلمة المرور
    const publicId = await generateUniquePublicId(this.userModel, 'us');
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      publicId,
    });
    const savedUser = await newUser.save();

    return {
      success: true,
      message: 'user created successfully',
      data: savedUser,
    };
  }

  async getAllUsers(paginationDto: PaginationAndFilterDto, filters: any) {
    let { page, limit, allData, sortBy, order } = paginationDto;
  
    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;
  
    // تحديد حقل الفرز الافتراضي
    const sortField: string = sortBy ?? 'createdAt';
    const sort: { [key: string]: 1 | -1 } = {
      [sortField]: order === 'asc' ? 1 : -1, // تحديد الاتجاه بناءً على 'asc' أو 'desc'
    };
  
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
    let RoleIds: string[] = [];
    const allowedStatuses = ['true', 'false'];
    if (filters.isActive && filters.isActive!== null) {
      if (allowedStatuses.includes(filters.isActive)) {
        filterConditions.push({ isActive: filters.isActive });
      } else {
        throw new Error(`Invalid status value. Allowed values: ${allowedStatuses.join(', ')}`);
      }
    }
  // تحقق إذا كان يوجد نص للبحث في الحقول النصية (name, email)
  if (filters.search) {
    const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الأحرف

    // إضافة شروط البحث للحقول النصية
    searchConditions.push(
      { name: regex },         // البحث في الحقل name
      { email: regex },        // البحث في الحقل email
    );
    const Roles = await this.roleModel.find({ name: regex }).select('_id');
    RoleIds = Roles.map(role => role._id.toString());
    const searchOrConditions: Record<string, any>[] = [];
    if (RoleIds.length) {
      searchOrConditions.push({ roleIds: { $in: RoleIds } });
    }
    if (searchOrConditions.length) {
      searchConditions.push({ $or: searchOrConditions });
    } else {
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }
  }
  
    // تحقق إذا كان يوجد تاريخ لإنشاء المستخدم
    if (filters.createdAt) {
      const createdAt = new Date(filters.createdAt);
      searchConditions.push({ createdAt: { $gte: createdAt } });
    }
    delete filters.search;
    delete filters.isActive;
    // دمج الفلاتر مع شروط البحث
    const finalFilter = {
      ...filters,
      ...(searchConditions.length > 0 ? { $or: searchConditions } : {}),
      ...(filterConditions.length > 0 ? { $and: filterConditions } : {})
    };
  
    // استخدم paginate مع populate
    const result = await paginate(
      this.userModel,
      [{path:"roleIds",select:'name'}], 
      page,
      limit,
      allData,
      finalFilter, 
      sort, 
    );
  
   
    return result;
  }
  

  async getUserById(id: string): Promise<ApiGetResponse<User>> {
    const user = await this.userModel.findById(id).populate(['roleIds']).exec();

    if (!user) throw new NotFoundException('User not found');

    return {
      success: true,
      message: 'user retrieved successfully',
      data: user,
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiGetResponse<User>> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');

    return {
      success: true,
      message: 'User update successfully',
      data: updatedUser,
    };
  }

  async deleteUser(id: string): Promise<ApiGetResponse<User>> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    return {
      success: true,
      message: 'user remove successfully',
      data: {} as User,
    };
  }

  async getUserByClinicCollectionId(
    clinicCollectionId: string,
  ): Promise<User | null> {
    return this.userModel
      .findOne({ clinicCollectionId })

      .exec();
  }

  // Change password (requires current password)
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiGetResponse<string>> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    return {
      success: true,
      message: 'Password changed successfully',
      data: '',
    };
  }

  // Reset password (admin or token-based)
  async resetPassword(
    userId: string,
    newPassword: string,
  ): Promise<ApiGetResponse<string>> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    return {
      success: true,
      message: 'Password reset successfully',
      data: '',
    };
  }
}
