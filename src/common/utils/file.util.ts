import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

export const removeFileFromLocal = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    await promisify(fs.access)(fullPath, fs.constants.F_OK);
    await promisify(fs.unlink)(fullPath);
  } catch (error) {
    // File doesn't exist or couldn't be deleted, which is fine
    console.warn(`Could not remove file: ${filePath}`, error.message);
  }
};

export const fileUtils = {
  removeFileFromLocal,
};
