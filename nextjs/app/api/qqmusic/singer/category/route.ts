import qqMusic from 'qq-music-api';
export async function GET() {
  const data = await qqMusic.api('/singer/category');
  return Response.json(data);
}
