import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

interface ISearchResult {
  id: number;
  name: string;
  artist: string;
  album: string;
  coverPath: number;
}

const searchByPaging = async (query: string, limit: number, offset: number) => {
  return await prisma.$transaction(async () => {
    const data = await prisma.$queryRaw<ISearchResult[]>(
      Prisma.sql`
	WITH AllArtists AS (
		SELECT
			MA."musicId",
			STRING_AGG ( S."name", ', ' ) AS artist 
		FROM
			"MusicArtist" MA
			JOIN "Singer" S ON MA."singerId" = S."id" 
		GROUP BY
			MA."musicId" 
		) SELECT M
		."id",
		M."name" AS "name",
		AA.artist,
		AL."name" AS album,
		C."filePath" as "coverPath"
	FROM
		"Music" M 
		LEFT JOIN AllArtists AA ON M."id" = AA."musicId"
		LEFT JOIN "Album" AL ON M."albumId" = AL."id"
        LEFT JOIN "Cover" C ON C."id" = AL."coverId" 
	WHERE
		M."name" LIKE ${Prisma.join([`%${query}%`])}
		OR AA.artist LIKE ${Prisma.join([`%${query}%`])}
		OR AL."name" LIKE ${Prisma.join([`%${query}%`])} 
	GROUP BY M."id", M.url, M."name", AA.artist, AL."name", C."filePath"
	ORDER BY M."id", MAX ( M."createdAt" ) DESC 
	LIMIT ${Prisma.join([limit])} OFFSET ${Prisma.join([offset])};`
    );
    const total = await prisma.$queryRaw<{ count: number }[]>(
      Prisma.sql`
	  WITH AllArtists AS (
		SELECT
		        MA."musicId",
		        STRING_AGG(S."name", ', ') AS artist
		    FROM
		        "MusicArtist" MA
		        JOIN "Singer" S ON MA."singerId" = S."id"
		    GROUP BY
		        MA."musicId"
		)
		SELECT COUNT(*)::TEXT AS "count"
		FROM (
		    SELECT
		        M."id"
		    FROM
		        "Music" M
		        LEFT JOIN AllArtists AA ON M."id" = AA."musicId"
		        LEFT JOIN "Album" AL ON M."albumId" = AL."id"
		    WHERE
		        M."name" LIKE ${Prisma.join([`%${query}%`])}
		        OR AA.artist LIKE ${Prisma.join([`%${query}%`])}
		        OR AL."name" LIKE ${Prisma.join([`%${query}%`])}
		    GROUP BY
		        M."id"
		) AS query;`
    );
    return { data, count: +total[0].count };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const pages = +(searchParams.get('pages') || 1);
  const pageSize = +(searchParams.get('count') || 20);

  if (!query) {
    throw new Error('query is required');
  }

  const { data, count } = await searchByPaging(
    query,
    pageSize,
    (pages - 1) * pageSize
  );

  const { MINIO_ENDPOINT, MINIO_BUCKET } = process.env;
  const result = data.map((x) => {
    return {
      ...x,
      coverUrl: `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${x.coverPath}`,
    };
  });

  return Response.json({
    data: result,
    count,
  });
}
