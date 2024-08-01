import { promises as fs } from 'fs';

export default async function imageToBase64(filePath: string): Promise<string> {
  try {
    const bitmap = await fs.readFile(filePath);
    return Buffer.from(bitmap).toString('base64');
  } catch (error) {
    throw new Error(
      `Error reading file from path: ${filePath}. Error: ${JSON.stringify(
        error
      )}`
    );
  }
}
