// import { customAlphabet } from 'nanoid';
import mongoose, { Model } from 'mongoose';

// const generateId = customAlphabet('0123456789', 4);

/**
 * يولد معرف فريد بصيغة prefix-#### ويتأكد أنه غير مكرر في الموديل
 * @param model موديل Mongoose
 * @param prefix بادئة (مثلاً: us، emp، doc...)
 * @param field اسم الحقل (مثل publicId)
 * @returns قيمة معرف فريد مثل us-4832
 */
export const generateUniquePublicId = async (
  model: Model<any>,
  prefix: string,
  field: string = 'publicId',
): Promise<string> => {
  let isUnique = false;
  let publicId = '';

  while (!isUnique) {
    // const random = generateId();
    publicId = `${prefix}-${"random"}`;

    const exists = await model.findOne({ [field]: publicId });
    if (!exists) {
      isUnique = true;
    }
  }

  return publicId;
};
