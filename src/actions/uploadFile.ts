'use server';

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function processFile(file: File) {
  const uploadDir = path.join(process.cwd(), '/uploads');
  const buffer = await file.arrayBuffer();
  const filePath = path.join(uploadDir, file.name);

  console.log(`Uploading file to ${filePath}`);
  /*
  try {
    await fs.writeFile(filePath, Buffer.from(buffer));
    console.log(`File uploaded successfully to ${filePath}`);
  } catch (error) {
    console.error('Error writing file:', error);
  }
*/
  return NextResponse.json({ success: true, filePath });
}

export async function onFilesAccepted(files: File[]) {

  console.log('onFileAccepted', files);
  for (const file of files) {
    await processFile(file); // Call the server action to process each file
  }
}