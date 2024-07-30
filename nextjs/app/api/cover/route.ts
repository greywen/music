import { CoverImgSize, getCoverImg } from '@/service/music';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const size = +(searchParams.get('size') || 300) as CoverImgSize;

  if (!id) {
    throw new Error('id is required');
  }

  const data = await getCoverImg({ id, size });
  return new Response(JSON.stringify(data));
}
