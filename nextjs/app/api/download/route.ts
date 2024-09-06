import { IMusic } from '@/interfaces/music';
import downloadMusic from '@/utils/downloadMusic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let musicList = (await request.json()) as IMusic[];
  musicList = await downloadMusic(musicList);
  return NextResponse.json(musicList);
}
