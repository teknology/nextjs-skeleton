'use server';

import path from 'path';
import fs, { mkdir } from 'fs';
import { updateUserAvatar } from '@/db/queries/user';
import { uploadsPath, createProfileImagePath } from '@/utils/public-paths';

interface ProcessFileFormState {
  errors: {
    _form?: string[];
  }
}
export async function processFile(
  formData: FormData
): Promise<ProcessFileFormState> {


  const file = formData.get('file') as File;
  const arrayBuffer = await file.arrayBuffer();
  const userid = formData.get('userid') as string;
  const buffer = new Uint8Array(arrayBuffer);
  // Define the directory path
  const publicPath = createProfileImagePath(userid, file.name);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', userid, 'profile');
  const fullPath = path.join(uploadDir, file.name);
  const fileExists = fs.existsSync(fullPath);

  if (!file) {
    return {
      errors: {
        _form: ['File is missing']
      }
    }
  };
  if (!userid || userid === '') {
    return {
      errors: {
        _form: ['User ID is missing']
      }
    }
  }

  if (fileExists) {

    try {
      await updateUserAvatar(userid, publicPath);

    }
    catch (err: unknown) {
      if (err instanceof Error) {
        return {
          errors: {
            _form: [err.message]
          }
        }
      } else {
        return {
          errors: {
            _form: ['Failed to update avatar with existing file']
          }
        }
      }
    }
    throw new Error('File already exists');

  }


  try {
    if (!fs.existsSync(uploadDir)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    await fs.promises.writeFile(fullPath, buffer);
    await updateUserAvatar(userid, publicPath);

  }
  catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message]
        }
      }
    } else {
      return {
        errors: {
          _form: ['Failed to save file']
        }
      }
    }
  }


  return {
    errors: {
      _form: []
    }
  }




}
export async function fileExists(filename: string): Promise<boolean> {
  try {
    const fileExists = fs.existsSync(filename);
    return fileExists;
  }
  catch (err) {
    return false;
  }
}