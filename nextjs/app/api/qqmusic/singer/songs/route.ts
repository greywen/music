import QQMusicService from '@/service/qqmusicService';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const singermid = searchParams.get('singermid')!;
  const num = +(searchParams.get('num') || 20);
  const page = +(searchParams.get('page') || 1);
  const data = await QQMusicService.singerSong({ singermid, num, page });
  return new Response(JSON.stringify(data));
}
