import prisma from '@/prisma/prisma';
import { getCover, getLyric, getMusicInfo } from '@/service/music';
import createFolder from '@/utils/createFolder';
import { downloadFile, getUrlExtension } from '@/utils/downloadFile';
import imageToBase64 from '@/utils/imageToBase64';

async function downloadMusic(music: IMusic) {
  console.time('download music');
  const { id, source, name, artist } = music;
  const musicSavePath = process.env.MUSIC_SAVE_PATH!;
  await createFolder(musicSavePath);
  const musicInfo = await getMusicInfo({ id, source, br: 320 });
  console.log('music url: \n', musicInfo.url);
  const musicPath = `${musicSavePath}/${artist.join()} - ${name}${getUrlExtension(
    musicInfo.url
  )}`;
  await downloadFile({
    url: musicInfo.url,
    filePath: musicPath,
  });
  console.timeEnd('download music');
  return { musicInfo, musicPath };
}

async function downloadCover(music: IMusic) {
  console.time('download cover');
  const { id, source, pic_id } = music;
  const coverSavePath = process.env.COVER_SAVE_PATH!;
  await createFolder(coverSavePath);
  const cover = await getCover({ id: pic_id, source, size: 500 });
  console.log('cover url: \n', cover.url);
  const coverPath = `${coverSavePath}/${id}${getUrlExtension(cover.url)}`;
  await downloadFile({
    url: cover.url,
    filePath: coverPath,
  });
  console.timeEnd('download cover');

  console.time('convert cover');
  const coverBase64 = await imageToBase64(coverPath);
  console.timeEnd('convert cover');

  return coverBase64;
}

async function findMusicIds(ids: string[]) {
  const musics = await prisma.music.findMany({
    where: { mid: { in: ids } },
    select: { mid: true },
  });
  return musics.map((x) => x.mid);
}

export async function POST(request: Request) {
  let musicList = (await request.json()) as IMusic[];
  const musics = await findMusicIds(musicList.map((music) => music.id));
  musicList = musicList.filter((x) => !musics.includes(x.id));
  for (const music of musicList) {
    const { id, source, name, lyric_id, artist, album } = music;
    console.log(`${artist.join()} - ${name}`);
    const lyric = await getLyric({ id: lyric_id, source });
    const { musicInfo, musicPath } = await downloadMusic(music);
    const coverBase64 = await downloadCover(music);
    await prisma.music.create({
      data: {
        mid: id,
        name,
        artist: artist.join(','),
        album,
        url: musicPath,
        lyric: lyric.lyric,
        cover: coverBase64,
        br: musicInfo.br,
        size: musicInfo.size,
        source,
      },
    });
  }
  return Response.json(musicList);
}
