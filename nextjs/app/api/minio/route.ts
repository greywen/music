import prisma from '@/prisma/prisma';
import { Client } from 'minio';
import * as path from 'path';

async function processUpload(
  minioClient: Client,
  musics: { id: number; url: string }[]
) {
  const promises = musics.map(async (music) => {
    const bucketName = process.env.MINIO_BUCKET_NAME!;
    const fileName = path.basename(music.url);
    const objectName = 'data/' + fileName;
    await minioClient.fPutObject(bucketName, objectName, music.url, {
      'Content-Type': 'audio/mpeg',
    });
    const updateResult = await prisma.music.update({
      data: { objectName },
      where: { id: music.id },
    });
    console.log('Update', updateResult.name, updateResult.objectName);
  });

  const promiseList = await Promise.all(promises);
  return promiseList;
}

export async function POST() {
  const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT } = process.env;

  const minioClient = new Client({
    endPoint: MINIO_ENDPOINT!,
    useSSL: true,
    accessKey: MINIO_ACCESS_KEY!,
    secretKey: MINIO_SECRET_KEY!,
  });

  const musics = await prisma.music.findMany({
    select: { id: true, url: true },
  });

  processUpload(minioClient, musics);

  return Response.json({ message: 'ok' });
}
