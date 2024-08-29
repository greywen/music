import QQMusicService from '@/service/qqmusicService';
export async function GET() {
  const data = await QQMusicService.topCategory();
  return new Response(JSON.stringify(data));
}
