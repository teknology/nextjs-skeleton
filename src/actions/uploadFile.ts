'use server';

interface ProcessFileFormState {
  message?: string;
  errors: {
    //   agreeTerms?: string[];
    _form?: string[];
  }
}
export async function processFile(
  formData: FormData
): Promise<ProcessFileFormState> {

  const file = formData.get('file') as File;
  console.log(file);


  return {
    message: 'File uploaded successfully',
    errors: {}
  }

}

export async function saveDocumentInteraction(formData: FormData) {
  const file = formData.get('file') as File;
  //const userId = formData.get('userId') as string;
  const documentHash = formData.get('documentHash') as string;

  await saveFile(file, documentHash);

}

import fs from 'fs';

async function saveFile(file: File, documentHash: string) {
  const data = await file.arrayBuffer();
  await fs.promises.appendFile(`./public/${documentHash}.pdf`, Buffer.from(data));
  return;
}