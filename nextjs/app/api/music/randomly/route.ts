import prisma from '@/prisma/prisma';
import { getFilePublicUrl } from '@/utils/minio';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface IRandomResult {
  id: number;
  name: string;
  lyricId: number;
  artist: string;
  album: string;
  coverPath: string;
}

const search = async (limit: number = 100) => {
  return await prisma.$queryRaw<IRandomResult[]>(
    Prisma.sql`WITH AllArtists AS (
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
				M."lyricId" AS "lyricId",
	    	AA.artist,
	    	AL."name" AS album,
	    	C."filePath" as "coverPath"
	    FROM
	    	"Music" M 
	    	LEFT JOIN AllArtists AA ON M."id" = AA."musicId"
	    	LEFT JOIN "Album" AL ON M."albumId" = AL."id"
        LEFT JOIN "Cover" C ON C."id" = AL."coverId" 
	      LEFT JOIN "Lyric" L ON L."id" = M."lyricId" 
        WHERE
          M."id" IN ( SELECT M."id" FROM "Music" M ORDER BY RANDOM() LIMIT ${Prisma.join(
            [limit]
          )} ) 
	    GROUP BY M."id", M."name", AA.artist, AL."name", C."filePath";`
  );
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = +(searchParams.get('count') || 0);
  if (!limit) {
    return NextResponse.json([]);
  }
  const data = await search();
  const result = data.map((x) => {
    return {
      ...x,
      coverUrl: getFilePublicUrl(x.coverPath),
    };
  });
  return NextResponse.json(result);
}
