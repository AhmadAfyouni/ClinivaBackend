import { Model } from 'mongoose';

export const generateUniquePublicId = async (
  model: Model<any>,
  prefix: string,
  field: string = 'publicId',
): Promise<string> => {
  let isUnique = false;
  let publicId = '';

  while (!isUnique) {
    const random = generateRandomNumber(4); // مثلاً: 9271
    publicId = `${prefix}-${random}`;       // مثال: doc-9271

    const exists = await model.findOne({ [field]: publicId });
    if (!exists) {
      isUnique = true;
    }
  }

  return publicId;
};

function generateRandomNumber(length: number = 4): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
