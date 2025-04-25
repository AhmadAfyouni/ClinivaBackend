import { Model } from 'mongoose';

export interface ApiListResponse<T> {
  [x: string]: any;
  message: string;
  success: boolean;
  data: T[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    current_page_items_count:number
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}
export interface ApiGetResponse<T> {
  [x: string]: any;
  message: string;
  success: boolean;
  data: T;
}
export async function paginate<T>(
  model: Model<T>,
  populate: any = [],
  page: number = 1,
  limit: number = 10,
  allData: boolean = false,
  filter: any = {},
  sort: any = {},
  message: string = 'Request successful',
): Promise<ApiListResponse<T>> {
  const totalItems = await model.countDocuments(filter);

  // Ensure numbers are valid
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const pageNumber = Math.max(Number(page) || 1, 1);
  const skip = (pageNumber - 1) * limitNumber;

  console.log(
    `MongoDB Query Params: skip=${skip}, limit=${limitNumber}, allData=${allData}`,
  );

  //allData === true
  if (allData) {
    const data = await model.find(filter).populate(populate).sort(sort).exec();
    return {
      success: true,
      message,
      data,
      // pagination: , // Correctly set to null when fetching all data
    };
  }

  const data = await model
    .find(filter)
    .populate(populate)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber) // Ensures only `limit` number of records are returned
    .exec();

  console.log(`MongoDB Results Count: ${data.length}`);

  const totalPages = Math.ceil(totalItems / limitNumber);

  return {
    success: true,
    message,
    data,
    pagination: {
      current_page: pageNumber,
      total_pages: totalPages,
      total_items: totalItems,
      items_per_page: limitNumber, // Ensures it matches the number of items returned
      current_page_items_count:data.length,
      has_next_page: pageNumber * limitNumber < totalItems,
      has_previous_page: pageNumber > 1,
    },
  };
}
export async function applyModelFilter<T>(
  model: Model<T>,
  filters: any,
  filterKey: string,
  fieldName: string,
  targetKey: string,
  filterConditions: any[],
  page: number,
  limit: number
): Promise<{ data: any[]; total: number; page: number; limit: number; totalPages: number } | void> {
  if (filters[filterKey]) {
    const filterValue = filters[filterKey];

    if (filterValue === 'undefined' || filterValue === 'null') {
   
      return;
    }
    const query: Record<string, any> = {};
    query[fieldName] = filters[filterKey];
    
    const result = await model.findOne(query).select('_id');
    if (result && result._id) {
      filterConditions.push({ [targetKey]: result._id.toString() });
    } else {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }
}
export function applyBooleanFilter(
  filters: any,
  key: string,
  filterConditions: any[]
) {
  if (filters.hasOwnProperty(key)) {
    const value = filters[key];

    const normalizedValue =
      value === 'null' ? null :
      value === 'true' ? true :
      value === 'false' ? false :
      value;

    if (normalizedValue === null) {
      // تجاهل الفلتر
      return;
    }

    if (typeof normalizedValue === 'boolean') {
      filterConditions.push({ [key]: normalizedValue });
    } else {
      throw new Error(`Invalid ${key} value. Allowed values: true, false, null`);
    }
  }
}

export function extractId(field: any): string | null {
  if (!field) return null;
  if (typeof field === 'object' && '_id' in field) return field._id.toString();
  if (typeof field === 'string') return field;
  return null;
}



export function addDateFilter(
  filters: Record<string, any>,
  key: string,
  searchConditions: any[]
) {
  const rawValue = filters[key];

  if (!rawValue) return;

  const dateOnly = new Date(rawValue);
  if (isNaN(dateOnly.getTime())) return;

  // ضبط بداية اليوم ونهايته (UTC) لتفادي مشاكل التوقيت المحلي
  const startOfDay = new Date(Date.UTC(
    dateOnly.getUTCFullYear(),
    dateOnly.getUTCMonth(),
    dateOnly.getUTCDate(),
    0, 0, 0, 0
  ));

  const endOfDay = new Date(Date.UTC(
    dateOnly.getUTCFullYear(),
    dateOnly.getUTCMonth(),
    dateOnly.getUTCDate(),
    23, 59, 59, 999
  ));

  searchConditions.push({
    [key]: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
}


export function buildFinalFilter(
  filters: Record<string, any>,
  searchConditions: Record<string, any>[],
  filterConditions: Record<string, any>[]
): Record<string, any> {
  const andConditions: Record<string, any>[] = [];

  if (Object.keys(filters).length > 0) {
    andConditions.push(filters);
  }

  if (searchConditions.length > 0) {
    andConditions.push({ $or: searchConditions });
  }

  if (filterConditions.length > 0) {
    andConditions.push(...filterConditions);
  }

  return andConditions.length > 0 ? { $and: andConditions } : {};
}
