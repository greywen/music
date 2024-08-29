import qqMusic from 'qq-music-api';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const songmid = searchParams.get('songmid');
  const data = await qqMusic.api('/lyric', { songmid });
  return new Response(JSON.stringify(data));
}
