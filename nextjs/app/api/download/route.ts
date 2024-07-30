import { getCover, getLyric, getMusicInfo } from '@/service/music';
import { downloadFile, getUrlExtension } from '@/utils/downloadFile';

export async function POST(request: Request) {
  const musicList = (await request.json()) as IMusicList[];
  const savePath = process.env.MUSIC_SAVE_PATH;
  for (const music of musicList) {
    const { id, source, lyric_id, pic_id } = music;
    const musicInfo = await getMusicInfo({ id, source, br: 320 });
    const cover = await getCover({ id: pic_id, source, size: 500 });
    const lyric = await getLyric({ id: lyric_id, source });
    const musicPath = `${savePath}/${getUrlExtension(musicInfo.url)}`;
    const coverPath = `${savePath}/${getUrlExtension(cover.url)}`;
    await downloadFile({
      url: musicInfo.url,
      filePath: musicPath,
    });
    await downloadFile({
      url: cover.url,
      filePath: coverPath,
    });
  }
  return Response.json(musicList);
}
