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
      items_per_page: data.length, // Ensures it matches the number of items returned
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
    const query: Record<string, any> = {};
    query[fieldName] = filters[filterKey];

    const result = await this.model.findOne(query).select('_id');
    if (result) {
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
