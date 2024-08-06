import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

interface ISearchResult {
  id: number;
  name: string;
  singer: string;
  album: string;
}

const search = async (query: string, limit: number, offset: number) => {
  return await prisma.$queryRaw<ISearchResult[]>(
    Prisma.sql`
      SELECT DISTINCT ON
      	( M."id" ) M."id",
      	M."name" AS "name",
      	S."name" AS singer,
      	AL."name" AS album 
      FROM
      	"Music"
      	M LEFT JOIN "MusicArtist" MA ON M.ID = MA."musicId"
      	LEFT JOIN "Singer" S ON ma."singerId" = S."id"
      	LEFT JOIN "Album" AL ON M."albumId" = AL."id" 
      WHERE
      	M.NAME LIKE ${Prisma.join([`%${query}%`])}
      	OR S.NAME LIKE ${Prisma.join([`%${query}%`])}
      	OR AL."name" LIKE ${Prisma.join([`%${query}%`])}
      ORDER BY
      	M."id",
      	M."createdAt" DESC 
      	LIMIT ${Prisma.join([limit])} OFFSET ${Prisma.join([offset])};`
  );
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const pages = +(searchParams.get('pages') || 1);
  const count = +(searchParams.get('count') || 20);
  if (!query) {
    throw new Error('query is required');
  }
  const data = await search(query, count, pages - 1);
  return new Response(JSON.stringify(data));
}
