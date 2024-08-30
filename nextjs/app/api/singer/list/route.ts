import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

const searchByPaging = async (
  query: string | null,
  skip: number,
  take: number
) => {
  return await prisma.$transaction(async () => {
    let where = {} as Prisma.SingerWhereInput;
    if (query) {
      where.name = query;
    }
    const data = await prisma.singer.findMany({
      where,
      skip,
      take,
    });
    const count = await prisma.singer.count({ where });
    return { data, count };
  });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const pages = +(searchParams.get('pages') || 1);
  const pageSize = +(searchParams.get('count') || 20);

  const { data, count } = await searchByPaging(
    query,
    (pages - 1) * pageSize,
    pageSize
  );

  return new Response(JSON.stringify({ list: data, total: count }));
}
