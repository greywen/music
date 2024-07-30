import { getMusicInfo, MusicBr, Source } from '@/service/music';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const source = (searchParams.get('source') || Source.tencent) as Source;
  const br = +(searchParams.get('br') || 320) as MusicBr;

  if (!id) {
    throw new Error('id is required');
  }

  const data = await getMusicInfo({ id, source, br });
  return new Response(JSON.stringify(data));
}
