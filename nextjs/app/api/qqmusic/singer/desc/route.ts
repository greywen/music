import { NextRequest, NextResponse } from 'next/server';
import qqMusic from 'qq-music-api';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const singermid = searchParams.get('singermid');
  const data = await qqMusic.api('/singer/desc', { singermid });
  return NextResponse.json(data);
}
