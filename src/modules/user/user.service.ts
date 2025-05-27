import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiGetResponse } from 'src/common/utlis/paginate';
import { PaginationAndFilterDto } from 'src/common/dtos/pagination-filter.dto';
import { RoleDocument, Role } from '../role/schemas/role.schema';
import { generateUniquePublicId } from 'src/common/utlis/id-generator';
import {
  SystemLogService,
  CreateLogDto,
} from '../SystemLogAction/system-log.service';
import { SystemLogAction } from '../SystemLogAction/log_schema';
import { FilterSort, PaginationOptions } from 'src/common/utils'; // Import the new FilterSort utility
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
    try {
      // Check if email already exists
      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException(
          'The email is already in use. Please enter a unique value for this field',
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );
      const publicId = await generateUniquePublicId(this.userModel, 'us');
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        publicId,
      });
      const savedUser = await newUser.save();

      return {
        success: true,
        message: 'User created successfully',
        data: savedUser,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the conflict exception we created
      }
      throw new BadRequestException(
        'An error occurred while creating the user. Please try again.',
      );
    }
  }

  /**
   * Get all users with pagination, filtering, and sorting
   * @param paginationDto Pagination and filtering options
   * @param filters Additional filters
   * @returns Paginated list of users
   */
  async getAllUsers(
    paginationDto: PaginationAndFilterDto,
    filters: Record<string, any> = {}
  ) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        order = 'desc', 
        search,
        status,
        startDate,
        endDate,
        includeDeleted = false,
        fields
      } = paginationDto;
      
      // Initialize FilterSort with user model
      const filterSort = new FilterSort<UserDocument>(this.userModel as Model<UserDocument>);
      
      // Build the base query
      const query: Record<string, any> = {};
      
      // Handle soft-deleted records
      if (!includeDeleted) {
        query.deleted = { $ne: true };
      }
      
      // Define searchable fields
      const searchFields: (keyof User)[] = ['name', 'email'];
      
      // Handle role filter if roleName is provided
      if (filters.roleName) {
        const role = await this.roleModel.findOne({ name: filters.roleName });
        if (role) {
          query.roleIds = role._id;
        }
      }
      
      // Handle status filter if provided
      if (status) {
        query.status = status;
      }
      
      // Handle date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          const endOfDay = new Date(endDate);
          endOfDay.setHours(23, 59, 59, 999);
          query.createdAt.$lte = endOfDay;
        }
      }
      
      // Add text search filter if search term is provided
      if (search && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => ({
          [field]: { $regex: search, $options: 'i' }
        }));
        
        query.$or = searchConditions;
      }
      
      // Configure pagination and population options
      const options: PaginationOptions<UserDocument> = {
        page: Math.max(1, Number(page)),
        limit: Math.min(100, Math.max(1, Number(limit))), // Limit max items per page to 100
        sortBy,
        order: order as 'asc' | 'desc',
        populate: {
          path: 'roleIds',
          select: 'name',
          options: { strictPopulate: false }
        },
        select: fields ? fields.split(',').map(f => f.trim()) : undefined
      };
      
      // Execute the query with pagination, filtering, and sorting
      const result = await filterSort.paginate(options, query);
      
      // Format the response
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getUserById(id: string): Promise<ApiGetResponse<User>> {
    try {
      const user = await this.userModel
        .findOne({ _id: id, deleted: false })
        .populate(['roleIds'])
        .exec();

      if (!user || user.deleted)
        throw new NotFoundException('User not found or has been deleted');

      return {
        success: true,
        message: 'user retrieved successfully',
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
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
    if (!user || user.deleted)
      throw new NotFoundException(
        `User with email ${email} not found or has been deleted`,
      );
    return user;
  }

  async getUserByIdentifier(identifier: string): Promise<User> {
    const user = await this.userModel
      .findOne({
        $or: [{ email: identifier }, { name: identifier }],
      })
      .exec();

    if (!user || user.deleted) {
      throw new NotFoundException('Invalid email/username or password');
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<ApiGetResponse<User>> {
    try {
      if ('isActive' in updateUserDto && currentUserId == id) {
        throw new BadRequestException(
          'You cannot activate or deactivate your own account.',
        );
      }
      if (updateUserDto.email) {
        const existingEmailUser = await this.userModel.findOne({
          _id: { $ne: id },
          email: updateUserDto.email,
        });
        if (existingEmailUser) {
          throw new ConflictException(
            'The email is already in use. Please enter a unique value for this field',
          );
        }
      }

      if (updateUserDto.name) {
        const existingNameUser = await this.userModel.findOne({
          _id: { $ne: id },
          name: updateUserDto.name,
        });
        if (existingNameUser) {
          throw new ConflictException(
            'The name is already in use. Please enter a unique value for this field',
          );
        }
      }

      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          salt,
        );
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser || updatedUser.deleted) {
        throw new NotFoundException('User not found or has been deleted');
      }

      try {
        const logEntry: CreateLogDto = {
          userId: updatedUser._id.toString(),
          action: SystemLogAction.USER_PROFILE_UPDATE,
          details: { updatedFields: Object.keys(updateUserDto) },
        };
        await this.systemLogService.createLog(logEntry);
      } catch (logError) {
        console.error('Failed to create system log for user update:', logError);
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'An error occurred while updating the user. Please try again.',
      );
    }
  }

  async UpdateProfile(
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<ApiGetResponse<User>> {
    try {
      // Validate input
      if (!updateUserDto) {
        throw new BadRequestException('Update data is required');
      }
      if ('isActive' in updateUserDto) {
        throw new BadRequestException(
          'You cannot activate or deactivate your own account.',
        );
      }
      // Prepare update object
      const updateData: Partial<UpdateUserDto> = { ...updateUserDto };

      // Hash password if provided
      if (updateData.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      // Use the currentUserId instead of the separate id parameter
      const updatedUser = await this.userModel.findByIdAndUpdate(
        currentUserId,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updatedUser || updatedUser.deleted) {
        throw new NotFoundException('User not found or has been deleted');
      }

      // Create system log
      try {
        const logEntry: CreateLogDto = {
          userId: updatedUser._id.toString(),
          action: SystemLogAction.USER_PROFILE_UPDATE,
          details: { updatedFields: Object.keys(updateUserDto) },
        };
        await this.systemLogService.createLog(logEntry);
      } catch (logError) {
        console.error('Failed to create system log for user update:', logError);
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async deleteUser(
    id: string,
    currentUserId: string,
  ): Promise<ApiGetResponse<User>> {
    try {
      console.log('currentUserId', currentUserId);
      console.log('id', id);
      // Prevent user from deleting their own account
      if (currentUserId && currentUserId === id) {
        throw new BadRequestException('You cannot delete your own account');
      }

      const user = await this.userModel.findById(id).exec();
      if (!user || user.deleted) {
        throw new NotFoundException('User not found or has been deleted');
      }

      // Check if user is deactivated before allowing deletion
      if (user.isActive) {
        throw new BadRequestException(
          'This user cannot be deleted because they are currently active',
        );
      }

      user.deleted = true;
      user.isActive = false;
      user.name = `${user.name} (Deleted)${user.publicId}`;
      user.email = `(Deleted)${user.publicId}${user.email}`;

      const deletedUser = await user.save();

      try {
        const logEntry: CreateLogDto = {
          userId: deletedUser._id.toString(),
          action: SystemLogAction.USER_DELETED,
          details: {
            actionBy: currentUserId || 'system',
            reason: 'User account deleted',
          },
        };

        await this.systemLogService.createLog(logEntry);
      } catch (logError) {
        console.error('Failed to create system log for user delete:', logError);
      }

      return {
        success: true,
        message: 'User has been deleted successfully',
        data: deletedUser,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'An error occurred while deleting the user',
      );
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
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userId, { isActive }, { new: true })
        .exec();

      if (!user) throw new NotFoundException('User not found');

      return {
        success: true,
        message: `${
          isActive
            ? 'The account has been activated and is now usable in the system'
            : 'The account has been deactivated and can no longer be used in the system'
        }`,
        data: user,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
