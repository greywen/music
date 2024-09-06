import prisma from '@/prisma/prisma';
import { getFileNameAndExtension } from '@/utils/common';
import { existsSync } from 'fs';
import { Client } from 'minio';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_ENDPOINT, MINIO_PORT } =
    process.env;

  const minIOClient = new Client({
    endPoint: MINIO_ENDPOINT!,
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY!,
    secretKey: MINIO_SECRET_KEY!,
    port: +MINIO_PORT!,
  });

  const covers = await prisma.cover.findMany({
    select: { id: true, url: true },
    where: { filePath: { equals: null } },
    orderBy: { id: 'asc' },
  });

  console.log('covers count:', covers.length);

  const { MINIO_BUCKET_NAME, COVER_SAVE_PATH } = process.env!;
  for (const cover of covers) {
    try {
      const filePath = COVER_SAVE_PATH! + `/${cover.url}`;

      const existFile = await existsSync(filePath);
      if (!existFile) {
        await prisma.cover.delete({ where: { id: cover.id } });
      } else {
        const { extension } = getFileNameAndExtension(cover.url);
        const objectName = `cover/${uuidv4().replaceAll(
          '-',
          ''
        )}.${extension}`.toLocaleLowerCase();
        await minIOClient.fPutObject(MINIO_BUCKET_NAME!, objectName, filePath, {
          'Content-Type': 'image/' + extension,
        });
        const result = await prisma.cover.update({
          data: { filePath: objectName },
          where: { id: cover.id },
        });
        console.log('Update', result.url, result.filePath);
      }
    } catch (error) {
      console.error(`Error processing cover ID ${cover.id}:`, error);
    }
  }
  return NextResponse.json({ message: 'ok' });
}
