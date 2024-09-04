import prisma from '@/prisma/prisma';
import { existsSync } from 'fs';
import { Client } from 'minio';

async function uploadToMinIO(
  minIOClient: Client,
  musics: { id: number; url: string; lyricId: number | null }[]
) {
  const { MINIO_BUCKET_NAME, MUSIC_SAVE_PATH } = process.env!;
  const promises = musics.map(async (music) => {
    try {
      const filePath = MUSIC_SAVE_PATH! + `/${music.url}`;
      const existFile = await existsSync(filePath);
      if (!existFile) {
        await prisma.musicArtist.deleteMany({ where: { musicId: music.id } });
        await prisma.music.delete({ where: { id: music.id } });
        music.lyricId &&
          (await prisma.lyric.delete({ where: { id: music.lyricId } }));
        return;
      }

      const objectName = `data/${music.url}`;
      await minIOClient.fPutObject(MINIO_BUCKET_NAME!, objectName, filePath, {
        'Content-Type': 'audio/mpeg',
      });
      const updateResult = await prisma.music.update({
        data: { objectName },
        where: { id: music.id },
      });
      console.log('Update', updateResult.name, updateResult.objectName);
    } catch (error) {
      console.error(`Error processing music ID ${music.id}:`, error);
    }
  });

  const promiseList = await Promise.all(promises);
  return promiseList;
}

export async function POST() {
  const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT } = process.env;

  const minIOClient = new Client({
    endPoint: MINIO_ENDPOINT!,
    useSSL: true,
    accessKey: MINIO_ACCESS_KEY!,
    secretKey: MINIO_SECRET_KEY!,
  });

  const musics = await prisma.music.findMany({
    select: { id: true, url: true, lyricId: true },
    where: { objectName: { equals: null } },
  });

  console.log('musics count:', musics.length);

  await uploadToMinIO(minIOClient, musics);

  return Response.json({ message: 'ok' });
}
