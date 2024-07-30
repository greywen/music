import { getLyric, Source } from '@/service/music';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const source = (searchParams.get('source') || Source.tencent) as Source;

  if (!id) {
    throw new Error('id is required');
  }

  const data = await getLyric({ id, source });
  return new Response(JSON.stringify(data));
}
