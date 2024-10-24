import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import * as fs from 'fs';

interface IDownloadFileOptions {
  url: string;
  filePath: string;
}

export function getUrlExtension(url: string): string {
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;
  const match = path.match(/\.([^\.\/\?]+)(\?|$)/);
  return match ? `.${match[1]}` : '';
}

export async function downloadFile(
  options: IDownloadFileOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { url, filePath } = options;
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const file = fs.createWriteStream(filePath, { flags: 'w+' });

    protocol
      .get(parsedUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to get '${url}'. Status code: ${response.statusCode}`
            )
          );
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => reject(err));
      });
  });
}
