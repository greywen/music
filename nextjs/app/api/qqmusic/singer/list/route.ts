import { NextRequest, NextResponse } from 'next/server';
import qqMusic from 'qq-music-api';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const area = +(searchParams.get('area') || -100);
  const genre = +(searchParams.get('genre') || -100);
  const index = +(searchParams.get('index') || -100);
  const sex = +(searchParams.get('sex') || -100);
  const data = await qqMusic.api('/singer/list', { area, genre, index, sex });
  return NextResponse.json(data);
}
