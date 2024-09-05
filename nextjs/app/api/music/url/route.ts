import prisma from '@/prisma/prisma';
import { presignedGetObject } from '@/utils/minioClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = +(searchParams.get('id') || 0);
  const mid = searchParams.get('mid');
  const name = searchParams.get('name');

  let music = await prisma.music.findUnique({ where: { id } });
  if (!music) {
    throw new Error('music not found');
  }

  const bucketName = process.env.MINIO_BUCKET_NAME!;
  const url = await presignedGetObject(bucketName, music!.filePath!);
  return new Response(JSON.stringify({ url }));
}
