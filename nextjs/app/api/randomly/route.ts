import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

interface IRandomResult {
  id: number;
  name: string;
  singer: string;
  album: string;
  coverId: number;
}

const search = async () => {
  return await prisma.$queryRaw<IRandomResult[]>(
    Prisma.sql`
  SELECT DISTINCT ON
    ( M."id" ) M."id",
    M."name" AS "name",
    S."name" AS singer,
    AL."name" AS album,
    AL."coverId" AS "coverId" 
  FROM
    "Music"M 
    TABLESAMPLE SYSTEM (10)
    LEFT JOIN "MusicArtist" MA ON M.ID = MA."musicId"
    LEFT JOIN "Singer" S ON ma."singerId" = S."id"
    LEFT JOIN "Album" AL ON M."albumId" = AL."id" 
  ORDER BY
    M."id",
    M."createdAt" DESC
  LIMIT 100;`
  );
};

export async function GET() {
  const data = await search();
  return new Response(JSON.stringify(data));
}
