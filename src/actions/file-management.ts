'use server';

import path from 'path'; // Import path module for handling and transforming file paths
import fs, { mkdir } from 'fs'; // Import file system (fs) module for file operations
import { updateUserAvatar } from '@/db/queries/user'; // Import function to update user's avatar in the database
import { uploadsPath, createProfileImagePath } from '@/utils/public-paths'; // Import utility functions for file paths

interface ProcessFileFormState {
  errors: {
    _form?: string[]; // Optional array to store form-related error messages
  }
}

/**
 * Process the uploaded file, save it to the server, and update the user's avatar in the database.
 * @param formData - The form data containing the file and user information.
 * @returns The form state with any errors that occurred during processing.
 */
export async function processFile(
  formData: FormData
): Promise<ProcessFileFormState> {

  const file = formData.get('file') as File; // Retrieve the uploaded file from the form data
  const arrayBuffer = await file.arrayBuffer(); // Read the file into an ArrayBuffer
  const userid = formData.get('userid') as string; // Retrieve the user ID from the form data
  const buffer = new Uint8Array(arrayBuffer); // Convert the ArrayBuffer into a Uint8Array for file writing

  // Define the public path where the profile image will be stored
  const publicPath = createProfileImagePath(userid, file.name);

  // Set the directory path where the file will be uploaded
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', userid, 'profile');
  const fullPath = path.join(uploadDir, file.name); // Complete file path including the file name
  const fileExists = fs.existsSync(fullPath); // Check if the file already exists

  // Check if the file is missing
  if (!file) {
    return {
      errors: {
        _form: ['File is missing'] // Return an error if no file is provided
      }
    }
  };

  // Check if the user ID is missing
  if (!userid || userid === '') {
    return {
      errors: {
        _form: ['User ID is missing'] // Return an error if no user ID is provided
      }
    }
  }

  // Handle the case where the file already exists
  if (fileExists) {
    try {
      // If the file exists, update the user's avatar in the database with the existing file path
      await updateUserAvatar(userid, publicPath);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        return {
          errors: {
            _form: [err.message] // Handle any errors encountered during avatar update
          }
        }
      } else {
        return {
          errors: {
            _form: ['Failed to update avatar with existing file'] // Return a general error if the update fails
          }
        }
      }
    }
    // Throw an error indicating that the file already exists
    throw new Error('File already exists');
  }

  // Handle the file upload if it does not already exist
  try {
    // If the upload directory does not exist, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory and its parent directories
    }

    // Write the file to the server
    await fs.promises.writeFile(fullPath, buffer);

    // Update the user's avatar in the database with the new file path
    await updateUserAvatar(userid, publicPath);
  }
  catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message] // Return any errors encountered during the file writing or avatar update
        }
      }
    } else {
      return {
        errors: {
          _form: ['Failed to save file'] // Return a general error if the file save operation fails
        }
      }
    }
  }

  // If the process was successful, return an empty error object
  return {
    errors: {
      _form: [] // No errors
    }
  }
}

/**
 * Check if a file exists on the server.
 * @param filename - The name or path of the file to check.
 * @returns A boolean indicating whether the file exists.
 */
export async function fileExists(filename: string): Promise<boolean> {
  try {
    // Check if the file exists on the file system
    const fileExists = fs.existsSync(filename);
    return fileExists; // Return true if the file exists, otherwise false
  }
  catch (err) {
    return false; // Return false if an error occurs while checking for the file
  }
}
