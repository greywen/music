import qqMusic from 'qq-music-api';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albummid = searchParams.get('albummid');
  const data = await qqMusic.api('/album', { albummid });
  return new Response(JSON.stringify(data));
}
