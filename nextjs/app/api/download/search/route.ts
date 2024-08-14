import { Source } from '@/interfaces/music';
import { getMusicList } from '@/service/music';
import downloadMusic from '@/utils/downloadMusic';

export async function POST(request: Request) {
  const {
    query,
    count = 20,
    source = 'tencent',
  } = (await request.json()) as {
    query: string;
    source: Source;
    count: number;
  };

  if (!query) {
    throw new Error('query is required');
  }
  const musicList = await getMusicList({ name: query, count, source });
  return Response.json(await downloadMusic(musicList));
}
