import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

interface IRandomResult {
  id: number;
  name: string;
  singer: string;
  album: string;
  coverId: number;
}

export async function GET(request: Request) {
  const data = await prisma.$queryRaw<IRandomResult[]>(
    Prisma.raw(`
    SELECT DISTINCT ON
          ( M."id" ) M."id",
          M."name" AS "name",
          S."name" AS singer,
          AL."name" AS album,
          AL."coverId" AS "coverId" 
        FROM
          "Music"M 
          LEFT JOIN "MusicArtist" MA ON M.ID = MA."musicId"
          LEFT JOIN "Singer" S ON ma."singerId" = S."id"
          LEFT JOIN "Album" AL ON M."albumId" = AL."id" 
        WHERE
          M."id" IN ( SELECT M."id" FROM "Music" M ORDER BY RANDOM( ) LIMIT 100 ) 
        ORDER BY
          M."id",
          M."createdAt" DESC;`)
  );
  return new Response(JSON.stringify(data));
}
