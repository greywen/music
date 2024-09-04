import prisma from '@/prisma/prisma';
import { getFileNameAndExtension } from '@/utils/common';
import { existsSync } from 'fs';
import { Client } from 'minio';

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
    orderBy: { id: 'asc' },
    take: 50,
  });

  console.log('musics count:', musics.length);

  const { MINIO_BUCKET_NAME, MUSIC_SAVE_PATH } = process.env!;
  for (const music of musics) {
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

      const { extension } = getFileNameAndExtension(music.url);
      const objectName = `data/${music.id}.${extension}`.toLocaleLowerCase();
      await minIOClient.fPutObject(MINIO_BUCKET_NAME!, objectName, filePath, {
        'Content-Type': 'audio/mpeg',
      });
      const result = await prisma.music.update({
        data: { objectName },
        where: { id: music.id },
      });
      console.log('Update', result.name, result.objectName);
    } catch (error) {
      console.error(`Error processing music ID ${music.id}:`, error);
    }
  }
  return Response.json({ message: 'ok' });
}
