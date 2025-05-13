import { InternalServerErrorException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express'; // For Express.Multer.File type

/**
 * Saves an uploaded file to a specified destination within the 'uploads' directory.
 *
 * @param file The uploaded file object (Express.Multer.File).
 * @param destinationPath The path within the 'uploads' directory where the file should be saved
 *                        (e.g., 'clinics/logos', 'users/avatars').
 * @returns The relative path to the saved file from the root of the 'uploads' directory
 *          (e.g., 'clinics/logos/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.jpg').
 * @throws InternalServerErrorException if the file cannot be saved.
 */
export const saveFileLocally = (
  file: Express.Multer.File,
  destinationPath: string,
): string => {
  try {
    // Construct the base path to the general 'uploads' directory
    const baseUploadDir = join(process.cwd(), 'uploads');
    console.log('baseUploadDir', baseUploadDir);
    // Construct the full path to the specific target directory (e.g., uploads/clinics/logos)
    const targetDirectory = join(baseUploadDir, destinationPath);
    console.log('targetDirectory', targetDirectory);

    // Create the target directory if it doesn't exist
    if (!existsSync(targetDirectory)) {
      mkdirSync(targetDirectory, { recursive: true });
    }

    // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePathToSave = join(targetDirectory, uniqueFilename);

    // Save the file
    writeFileSync(filePathToSave, file.buffer);

    // Return the path relative to the desired serving prefix (e.g., 'clinics/logos/unique-name.jpg')
    // This path should align with how you construct URLs later (e.g., serverBaseUrl + /uploads/ + returnedPath)
    console.log(join(destinationPath, uniqueFilename).replace(/\\/g, '/'));
    console.log('destinationPath', destinationPath);
    console.log('uniqueFilename', uniqueFilename);
    return join('/uploads/' + destinationPath, uniqueFilename).replace(
      /\\/g,
      '/',
    ); // Ensure forward slashes for URL consistency
  } catch (error) {
    console.error('Error saving file locally:', error);
    // Consider logging the specific error for better debugging
    throw new InternalServerErrorException('Could not save uploaded file.');
  }
};
