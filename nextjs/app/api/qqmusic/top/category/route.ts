import qqMusic from 'qq-music-api';
export async function GET() {
  const data = await qqMusic.api('/top/category');
  return new Response(JSON.stringify(data));
}
