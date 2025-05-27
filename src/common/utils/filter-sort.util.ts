import { Model, FilterQuery, SortOrder, Document, Types, Query, PopulateOptions } from 'mongoose';

/**
 * Base document interface that all MongoDB documents should extend
 */
export interface BaseDocument extends Document<Types.ObjectId> {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

/**
 * Extended Mongoose document interface with additional type safety
 */
export interface MongooseDocument extends BaseDocument {}

/**
 * Query result type for Mongoose queries
 */
export type QueryResult<T> = Query<T[], T, {}, T>;

/**
 * Type for populate options
 */
export type PopulateOption = string | PopulateOptions | (string | PopulateOptions)[];

/**
 * Options for pagination and filtering
 */
export interface PaginationOptions<T> {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Field to sort by */
  sortBy?: string;
  /** Sort order */
  order?: 'asc' | 'desc';
  /** Fields to search in */
  searchFields?: (keyof T)[];
  /** Search term */
  search?: string;
  /** Additional filters */
  filters?: Record<string, any>;
  /** Population options */
  populate?: PopulateOption;
  /** Field selection */
  select?: string | string[] | Record<string, number>;
}

/**
 * Pagination result
 */
export interface PaginationResult<T> {
  /** Array of documents */
  data: T[];
  /** Total number of documents */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

export class FilterSort<T extends BaseDocument> {
  constructor(private readonly model: Model<T>) {}

  /**
   * Paginate and filter documents
   * @param options Pagination and filtering options
   * @param customQuery Additional query conditions
   * @returns Paginated result with data and metadata
   */
  async paginate(
    options: PaginationOptions<T> = {},
    customQuery: FilterQuery<T> = {},
  ): Promise<PaginationResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      searchFields = [],
      search = '',
      filters = {},
      populate = '',
      select = '',
    } = options;

    // Build the query
    const query: any = { ...customQuery };

    // Apply search
    if (search && searchFields.length > 0) {
      const searchConditions = searchFields.map((field) => ({
        [field as string]: { $regex: search, $options: 'i' },
      }));
      query.$or = searchConditions;
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key.endsWith('_gt')) {
          const field = key.replace('_gt', '');
          query[field] = { ...(query[field] || {}), $gt: value };
        } else if (key.endsWith('_lt')) {
          const field = key.replace('_lt', '');
          query[field] = { ...(query[field] || {}), $lt: value };
        } else if (key.endsWith('_ne')) {
          const field = key.replace('_ne', '');
          query[field] = { $ne: value };
        } else if (key.endsWith('_in')) {
          const field = key.replace('_in', '');
          query[field] = { $in: Array.isArray(value) ? value : [value] };
        } else if (typeof value === 'boolean') {
          query[key] = value;
        } else if (typeof value === 'string' && value) {
          query[key] = { $regex: value, $options: 'i' };
        } else {
          query[key] = value;
        }
      }
    });

    // Build sort
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Execute count query
    const total = await this.model.countDocuments(query as FilterQuery<T>);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Execute find query with proper typing
    let queryBuilder: Query<T[], T> = this.model.find(query as FilterQuery<T>);
    queryBuilder = queryBuilder.sort(sort).skip(skip).limit(limit);

    // Apply population if specified
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach((field) => {
          if (typeof field === 'string') {
            queryBuilder = queryBuilder.populate(field);
          } else if (field && typeof field === 'object') {
            // Handle populate options
            const { path, select, options, ...rest } = field as any;
            if (path) {
              queryBuilder = queryBuilder.populate({
                path,
                ...(select && { select }),
                ...(options && { options: { ...options, strictPopulate: false } }),
                ...rest
              } as any);
            }
          }
        });
      } else if (typeof populate === 'string') {
        queryBuilder = queryBuilder.populate(populate);
      } else if (populate) {
        queryBuilder = queryBuilder.populate(populate as any);
      }
    }

    // Apply field selection if specified
    if (select) {
      queryBuilder = queryBuilder.select(select);
    }

    const data = await queryBuilder.exec();

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  // Helper method to build filter conditions
  buildFilterConditions(filters: Record<string, any>): FilterQuery<T> {
    const query: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key.endsWith('_gt')) {
          const field = key.replace('_gt', '');
          query[field] = { ...(query[field] || {}), $gt: value };
        } else if (key.endsWith('_lt')) {
          const field = key.replace('_lt', '');
          query[field] = { ...(query[field] || {}), $lt: value };
        } else if (key.endsWith('_ne')) {
          const field = key.replace('_ne', '');
          query[field] = { $ne: value };
        } else if (key.endsWith('_in')) {
          const field = key.replace('_in', '');
          query[field] = { $in: Array.isArray(value) ? value : [value] };
        } else if (typeof value === 'boolean') {
          query[key] = value;
        } else if (typeof value === 'string' && value) {
          query[key] = { $regex: value, $options: 'i' };
        } else {
          query[key] = value;
        }
      }
    });

    return query as FilterQuery<T>;
  }

  // Helper method to build sort object
  buildSortOptions(sortBy: string, order: 'asc' | 'desc' = 'desc'): { [key: string]: SortOrder } {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;
    return sort;
  }

  /**
   * Creates a regex pattern for case-insensitive search
   * @param searchTerm The term to search for
   * @returns A regex pattern for case-insensitive search
   */
  createSearchRegex(searchTerm: string): RegExp {
    return new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }

  /**
   * Creates a date range filter
   * @param start Start date (optional)
   * @param end End date (optional)
   * @returns A date range filter object
   */
  createDateRangeFilter(start?: Date, end?: Date): { $gte?: Date; $lte?: Date } {
    const filter: { $gte?: Date; $lte?: Date } = {};
    if (start) filter.$gte = new Date(start);
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filter.$lte = endDate;
    }
    return filter;
  }

  /**
   * Creates a text search filter for multiple fields
   * @param searchTerm The term to search for
   * @param fields The fields to search in
   * @returns A text search filter object
   */
  createTextSearchFilter(searchTerm: string, fields: string[]) {
    if (!searchTerm || !fields.length) return {};

    const searchConditions = fields.map(field => ({
      [field]: { $regex: this.createSearchRegex(searchTerm) }
    }));

    return searchConditions.length > 1 ? { $or: searchConditions } : searchConditions[0];
  }
}
