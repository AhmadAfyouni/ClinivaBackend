import {
  BadRequestException,
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
import {
  addDateFilter,
  ApiGetResponse,
  applyBooleanFilter,
  applyModelFilter,
  buildFinalFilter,
  paginate,
} from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { RoleDocument, Role } from '../role/schemas/role.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import { Employee } from '../employee/schemas/employee.schema';
import { SystemLogService, CreateLogDto } from '../SystemLogAction/system-log.service'; // Adjust path if necessary
import { SystemLogAction } from '../SystemLogAction/log_schema'; // Corrected import for SystemLogAction
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private readonly systemLogService: SystemLogService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ApiGetResponse<User>> {
    try{
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
    }catch(error){
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async getAllUsers(paginationDto: PaginationAndFilterDto, filters: any) {
    try{
    let { page, limit, allData, sortBy, order } = paginationDto;

    // Convert page & limit to numbers
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    // تحديد حقل الفرز الافتراضي
    const sortField: string = sortBy ?? 'id';
    const sort: { [key: string]: 1 | -1 } = {
      [sortField]: order === 'asc' ? 1 : -1,
    }; // تحديد الاتجاه بناءً على 'asc' أو 'desc'
    console.log(sortField);
    const searchConditions: any[] = [];
    const filterConditions: any[] = [];
    let RoleIds: string[] = [];
    // By default, filter out deleted users    3.3
    //  explicitly requested
    if (!filters.hasOwnProperty('deleted')) {
      filterConditions.push({ deleted: false });
      console.log("deleted")
    } else {
      await applyBooleanFilter(filters, 'deleted', filterConditions);
    }
    
    await applyBooleanFilter(filters, 'isActive', filterConditions);
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i'); // غير حساس لحالة الأحرف

      const searchOrConditions: Record<string, any>[] = [
        { name: regex },
        { email: regex },
      ];

      const Roles = await this.roleModel.find({ name: regex }).select('_id');
      RoleIds = Roles.map((role) => role._id.toString());

      if (RoleIds.length > 0) {
        searchOrConditions.push({ roleIds: { $in: RoleIds } });
      }

      searchConditions.push({ $or: searchOrConditions });
    }

    // تحقق إذا كان يوجد تاريخ لإنشاء المستخدم
    addDateFilter(filters, 'createdAt', searchConditions);
    const roleResult = await applyModelFilter(
      this.roleModel,
      filters,
      'roleName',
      'name',
      'roleIds',
      filterConditions,
      page,
      limit,
    );
    if (roleResult) return roleResult;

    const fieldsToDelete = ['search', 'isActive', 'roleName', 'createdAt'];
    fieldsToDelete.forEach((field) => delete filters[field]);
    const finalFilter = buildFinalFilter(
      filters,
      searchConditions,
      filterConditions,
    );

    const result = await paginate(
      this.userModel,
      [{ path: 'roleIds', select: 'name' }, { path: 'employeeId' }],
      page,
      limit,
      allData,
      finalFilter,
      sort,
    );

    return result;
    }catch(error){
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async getUserById(id: string): Promise<ApiGetResponse<User>> {
    try{
    const user = await this.userModel
      .findOne({ _id: id, deleted: false })
      .populate(['roleIds', 'employeeId'])
      .exec();

    if (!user) throw new NotFoundException('User not found or has been deleted');

    return {
      success: true,
      message: 'user retrieved successfully',
      data: user,
    };
    }catch(error){
      console.log(error)
      throw new BadRequestException(error)
    }
  }
//   async getUserById(id: string): Promise<ApiGetResponse<User>> {
//     const user = await this.userModel.findById(id).populate(['roleIds', 'employeeId']).exec();

//     if (!user) throw new NotFoundException('User not found');

//     return {
//       success: true,
//       message: 'user retrieved successfully',
//       data: user,
//     };
// }

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
    try{
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');

    // Log the update action
    try {
      const logEntry: CreateLogDto = {
        userId: updatedUser._id.toString(),
        action: SystemLogAction.USER_PROFILE_UPDATE,
        details: { updatedFields: Object.keys(updateUserDto) } // Log which fields were in the DTO
      };
      // Optional: Add ipAddress and userAgent if available from the request context
      // logEntry.ipAddress = request?.ip;
      // logEntry.userAgent = request?.headers?.['user-agent'];
      await this.systemLogService.createLog(logEntry);
    } catch (logError) {
      console.error('Failed to create system log for user update:', logError);
      // Decide if you want to throw an error or just log it and continue
    }

    return {
      success: true,
      message: 'User update successfully',
      data: updatedUser,
    };
    }catch(error){
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async deleteUser(id: string): Promise<ApiGetResponse<User>> {
    try{
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    user.deleted = true;
    user.isActive = false;
    const deletedUser = await user.save();

    // Log the delete action
    try {
      const logEntry: CreateLogDto = {
        userId: deletedUser._id.toString(),
        action: SystemLogAction.USER_PROFILE_UPDATE, // Or a more specific USER_DELETE_SOFT if you add it to the enum
        details: { reason: 'User soft deleted' }
      };
      await this.systemLogService.createLog(logEntry);
    } catch (logError) {
      console.error('Failed to create system log for user delete:', logError);
    }

    return {
      success: true,
      message: 'User marked as deleted successfully',
      data: deletedUser,
    };
    }catch(error){
      console.log(error)
      throw new BadRequestException(error)
    }
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

  async changeActiveStatus(
    userId: string,
    isActive: boolean,
  ): Promise<ApiGetResponse<User>> {
    try{
    const user = await this.userModel
      .findByIdAndUpdate(userId, { isActive }, { new: true })
      .exec();
    
    if (!user) throw new NotFoundException('User not found');

    return {
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    };
    }catch(error){
      console.log(error)
      throw new BadRequestException(error)
    }
  }
}
