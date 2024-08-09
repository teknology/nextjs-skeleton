'use server';

import path from 'path';
import fs from 'fs';

interface ProcessFileFormState {
  message?: string;
  errors: {
    file?: string;
    userid?: string;
    //   agreeTerms?: string[];
    _form?: string[];
  }
}
export async function processFile(
  formData: FormData
): Promise<ProcessFileFormState> {

  const file = formData.get('file') as File;
  console.log(file);

  const userid = formData.get('userid') as string;

  if (!file || !userid) {
    return {
      errors: {
        file: !file ? 'File is required' : undefined,
        userid: !userid ? 'User ID is required' : undefined,
      }
    };
  }

  const directoryPath = path.join(__dirname, 'public', 'images', userid);

  // Create directory if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, file.name);

  // Save the file to the specified directory
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, fileBuffer);

  return {
    message: 'File uploaded successfully',
    errors: {}
  }

}
/*
export async function saveDocumentInteraction(formData: FormData) {
  const file = formData.get('file') as File;
  //const userId = formData.get('userId') as string;
  const documentHash = formData.get('documentHash') as string;

  await saveFile(file, documentHash);

}



async function saveFile(file: File, documentHash: string) {
  const data = await file.arrayBuffer();
  await fs.promises.appendFile(`./public/${documentHash}.pdf`, Buffer.from(data));
  return;
}
  */