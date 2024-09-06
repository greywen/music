import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

interface ISearchResult {
  id: number;
  name: string;
  singer: string;
  album: string;
  coverId: number;
  lyric: string;
}

const search = async (id: number) => {
  return await prisma.$queryRaw<ISearchResult[]>(
    Prisma.sql`
        SELECT
        	M."id",
        	M."name" AS "name",
        	S."name" AS singer,
        	AL."name" AS album,
        	AL."coverId" as "coverId",
        	L.text as lyric
        FROM
        	"Music" M 
          LEFT JOIN "MusicArtist" MA ON M.ID = MA."musicId"
        	LEFT JOIN "Singer" S ON ma."singerId" = S."id"
        	LEFT JOIN "Album" AL ON M."albumId" = AL."id"
        	LEFT JOIN "Lyric" L ON L."id" = M."lyricId"
        WHERE
        	M."id" = ${Prisma.join([id])};`
  );
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = +(searchParams.get('id') || 0);

  if (!id) {
    throw new Error('id is required');
  }

  const data = await search(id);
  return Response.json(data);
}
