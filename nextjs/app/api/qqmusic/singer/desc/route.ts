import qqMusic from 'qq-music-api';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const singermid = searchParams.get('singermid');
  const data = await qqMusic.api('/singer/desc', { singermid });
  return Response.json(data);
}
