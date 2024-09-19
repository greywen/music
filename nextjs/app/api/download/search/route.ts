import { Source } from '@/interfaces/music';
import { getMusicList } from '@/services/music';
import downloadMusic from '@/utils/downloadMusic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const {
    query,
    count = 20,
    source = 'tencent',
  } = (await request.json()) as {
    query: string;
    source: Source;
    count: number;
  };

  if (!query) {
    throw new Error('query is required');
  }
  const musicList = await getMusicList({ name: query, count, source });
  return NextResponse.json(await downloadMusic(musicList));
}
