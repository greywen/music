import qqMusic from 'qq-music-api';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = +(searchParams.get('type') || 0);
  const data = await qqMusic.api('/new/songs', { type });
  return new Response(JSON.stringify(data));
}
