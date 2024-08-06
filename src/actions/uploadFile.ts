'use server';

interface ProcessFilerFormState {
  errors: {
    //   agreeTerms?: string[];
    _form?: string[];
  }
}
export async function processFile(
  formState: ProcessFilerFormState,
  formData: FormData
): Promise<ProcessFilerFormState> {

  const file = formData.get('file') as File;
  console.log(file);

  return {
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