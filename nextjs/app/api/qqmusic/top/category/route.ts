import { NextRequest, NextResponse } from 'next/server';
import qqMusic from 'qq-music-api';
export async function GET() {
  const data = await qqMusic.api('/top/category');
  return NextResponse.json(data);
}
