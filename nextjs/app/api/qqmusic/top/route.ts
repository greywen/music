import { NextRequest, NextResponse } from 'next/server';
import qqMusic from 'qq-music-api';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = +(searchParams.get('id') || 4);
  const pageSize = +(searchParams.get('pageSize') || 100);
  const period = searchParams.get('period');

  const data = await qqMusic.api('/top', { id, pageSize, period });
  return NextResponse.json(data);
}
