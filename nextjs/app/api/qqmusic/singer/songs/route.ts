import qqMusic from 'qq-music-api';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const singermid = searchParams.get('singermid');
  const num = +(searchParams.get('num') || 100);
  const page = +(searchParams.get('page') || 1);
  const data = await qqMusic.api('/singer/songs', { singermid, num, page });
  return Response.json(data);
}
