import fs from 'fs';

export default async function createFolder(folderPath: string) {
  try {
    await fs.mkdirSync(folderPath, { recursive: true });
  } catch (error) {
    throw error;
  }
}
