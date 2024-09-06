import { NextRequest, NextResponse } from 'next/server';
import qqMusic from 'qq-music-api';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = +(searchParams.get('type') || 0);
  const data = await qqMusic.api('/new/songs', { type });
  return NextResponse.json(data);
}
