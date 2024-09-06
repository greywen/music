import prisma from '@/prisma/prisma';

interface IRandomResult {
  id: number;
  name: string;
  singer: string;
  album: string;
  coverPath: number;
}

const search = async () => {
  return await prisma.$queryRaw<IRandomResult[]>`
    SELECT DISTINCT ON
      ( M."id" ) M."id",
      M."name" AS "name",
      S."name" AS singer,
      AL."name" AS album,
      C."filePath" AS "coverPath" 
    FROM
      "Music" M 
      LEFT JOIN "MusicArtist" MA ON M.ID = MA."musicId"
      LEFT JOIN "Singer" S ON ma."singerId" = S."id"
      LEFT JOIN "Album" AL ON M."albumId" = AL."id" 
      LEFT JOIN "Cover" C ON C."id" = AL."coverId" 
    WHERE
      M."id" IN ( SELECT M."id" FROM "Music" M ORDER BY RANDOM() LIMIT 100 ) 
    ORDER BY
      M."id",
      M."createdAt" DESC;`;
};

export async function GET() {
  // const data = await search();
  // return Response.json(data);
}
