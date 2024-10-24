import { IMusic } from '@/interfaces/music';
import download from '@/utils/downloadMusic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let musicList = (await request.json()) as IMusic[];
  if (!musicList || musicList.length === 0) {
    throw new Error('musicList is required');
  }
  const ids = await download(musicList);
  return NextResponse.json(ids);
}
