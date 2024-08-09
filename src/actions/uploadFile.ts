'use server';

import path from 'path';
import fs, { mkdir } from 'fs';

interface ProcessFileFormState {
  errors: {
    _form?: string[];
  }
}
export async function processFile(
  formDrop: ProcessFileFormState,
  formData: FormData
): Promise<ProcessFileFormState> {

  const file = formData.get('file') as File;


  const arrayBuffer = await file.arrayBuffer();
  const userid = formData.get('userid') as string;
  const buffer = new Uint8Array(arrayBuffer);


  console.log(userid);
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
  // Define the directory path
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', userid, 'profile');
  const fullPath = path.join(uploadDir, file.name);
  const fileExists = fs.existsSync(fullPath);
  if (fileExists) {
    return {
      errors: {
        _form: ['File already exists. You may have uploaded this file already.']
      }
    }
  }


  if (!fs.existsSync(uploadDir)) {
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadDir, { recursive: true });
  }


  const result = await fs.promises.writeFile(fullPath, buffer);

  console.log(result);
  return {
    errors: {
      _form: []
    }
  };


  fs.writeFile(`${uploadDir}/${file.name}`, buffer, (err) => {
    console.log('writing file');
    if (err) {
      return {
        errors: {
          _form: ['Error writing file']
        }
      }
    }
  });






  // Create directory if it doesn't exist
  /*if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
    */





  return {
    errors: {
      _form: []
    }
  };
}
