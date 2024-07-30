import { getMusicList, Source } from '@/service/music';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const source = (searchParams.get('source') || Source.tencent) as Source;
  const pages = +(searchParams.get('pages') || 1);
  const count = +(searchParams.get('count') || 20);

  if (!name) {
    throw new Error('name is required');
  }

  const data = await getMusicList({ name, source, count, pages });
  return new Response(JSON.stringify(data));
}
