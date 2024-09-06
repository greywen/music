import prisma from '@/prisma/prisma';
import { getFilePublicUrl } from '@/utils/minio';
import { NextResponse } from 'next/server';

interface IRandomResult {
  id: number;
  name: string;
  artist: string;
  album: string;
  coverPath: string;
}

const search = async () => {
  return await prisma.$queryRaw<IRandomResult[]>`
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
      M."id" IN ( SELECT M."id" FROM "Music" M TABLESAMPLE SYSTEM (10) LIMIT 100 ) 
	GROUP BY M."id", M."name", AA.artist, AL."name", C."filePath";`;
};

export async function GET() {
  const data = await search();
  const result = data.map((x) => {
    return {
      ...x,
      coverUrl: getFilePublicUrl(x.coverPath),
    };
  });
  return NextResponse.json(result);
}
