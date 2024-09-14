import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Lyric {
  time: string;
  content: string;
}

function parseLyrics(lyrics: string): Lyric[] {
  const lines = lyrics.split('\n');
  const result: Lyric[] = [];

  const timeContentRegex = /^\[(\d+:\d+(:\d+)?(\.\d+)?)](.*)$/;

  for (const line of lines) {
    const match = timeContentRegex.exec(line);
    if (match) {
      const [, time, , , content] = match;
      result.push({ time, content: content.trim() });
    }
  }

  return result;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = +(searchParams.get('id') || 0);
  if (!id) {
    throw new Error('lyric not found');
  }
  const data = await prisma.lyric.findUnique({
    select: { lyric: true },
    where: { id },
  });
  if (!data) {
    throw new Error('lyric not found');
  }
  return NextResponse.json(parseLyrics(data.lyric));
}
