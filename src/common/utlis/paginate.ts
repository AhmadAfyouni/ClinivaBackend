import { Model } from 'mongoose';

export interface ApiResponse<T> {
  message: string;
  success: boolean,
  data?: T[] | T | null;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  } | null;
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
): Promise<ApiResponse<T>> {
  const totalItems = await model.countDocuments(filter);

  // Ensure numbers are valid
  const limitNumber = Math.max(Number(limit) || 10, 1);
  const pageNumber = Math.max(Number(page) || 1, 1);
  const skip = (pageNumber - 1) * limitNumber;

  console.log(`MongoDB Query Params: skip=${skip}, limit=${limitNumber}, allData=${allData}`);

  //allData === true
  if (allData) {
    const data = await model.find(filter).populate(populate).sort(sort).exec();
    return {
      success: true,
      message,
      data,
      pagination: null, // Correctly set to null when fetching all data
    };
  }

  const data = await model.find(filter).populate(populate)
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
