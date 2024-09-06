import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface IBody {
  name: string;
  count?: number;
  pages?: number;
}

export async function POST(request: NextRequest) {
  let body = (await request.json()) as IBody[];
  const result = await prisma.job.createMany({
    data: body.map((params) => ({ params: JSON.stringify(params) })),
  });
  return NextResponse.json(result);
}
