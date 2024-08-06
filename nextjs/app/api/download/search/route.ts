import { getMusicList } from '@/service/music';
import downloadMusic from '@/utils/downloadMusic';

export async function POST(request: Request) {
  const {
    name,
    count = 20,
    source = 'tencent',
  } = (await request.json()) as {
    name: string;
    source: Source;
    count: number;
  };
  const musicList = await getMusicList({ name, count, source });
  return Response.json(await downloadMusic(musicList));
}
