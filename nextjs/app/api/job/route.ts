import prisma from '@/prisma/prisma';

interface IBody {
  name: string;
  count?: number;
  pages?: number;
}

export async function POST(request: Request) {
  let body = (await request.json()) as IBody[];
  const result = await prisma.job.createMany({
    data: body.map((params) => ({ params: JSON.stringify(params) })),
  });
  return Response.json(result);
}
