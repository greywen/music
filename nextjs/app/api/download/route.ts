import downloadMusic from '@/utils/downloadMusic';

export async function POST(request: Request) {
  let musicList = (await request.json()) as IMusic[];
  musicList = await downloadMusic(musicList);
  return Response.json(musicList);
}
