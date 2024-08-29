import QQMusicService from '@/service/qqmusicService';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '4';
  const pageSize = +(searchParams.get('pageSize') || 100);
  const period = searchParams.get('period')!;

  const data = await QQMusicService.top({ id, pageSize, period });
  return new Response(JSON.stringify(data));
}
