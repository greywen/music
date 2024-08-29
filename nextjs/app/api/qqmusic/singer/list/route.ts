import QQMusicService from '@/service/qqmusicService';
import qqMusic from 'qq-music-api';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = +(searchParams.get('area') || -100);
  const genre = +(searchParams.get('genre') || -100);
  const index = +(searchParams.get('index') || -100);
  const sex = +(searchParams.get('sex') || -100);
  const pageNo = +(searchParams.get('pageNo') || 80);
  const data = await QQMusicService.singerList({
    area,
    genre,
    index,
    sex,
    pageNo,
  });
  return new Response(JSON.stringify(data));
}
