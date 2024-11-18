import path from 'path';
import { IMusic, MusicBr } from '../interfaces/music';
import {
  getCover,
  getLyric,
  getMusicInfo,
  getMusicInfoByApi,
} from '../services/music';
import createFolder from '../utils/createFolder';
import { downloadFile, getUrlExtension } from '../utils/downloadFile';
import fs from 'fs';

async function getMusicDownloadInfo(music: IMusic) {
  const { id, source } = music;
  let musicInfo = {} as { url: string; size: number; br: MusicBr };
  if (music.source === 'tencent') {
    musicInfo = await getMusicInfo({ id, source, br: 999 });
  } else {
    musicInfo = await getMusicInfoByApi({ id, source, br: 999 });
  }
  return { musicInfo };
}

async function downloadCover(music: IMusic) {
  const { source, pic_id } = music;
  const cover = await getCover({ id: pic_id, source, size: 500 });
  if (!cover?.url) return undefined;
  return cover.url;
}

export default async function download(musicList: IMusic[]) {
  const downloadedIds = [];
  try {
    for (const music of musicList) {
      const { id, source, name, lyric_id, artist, album } = music;
      let singerPath = path.join(`${process.env.MUSIC_SAVE_PATH}`, artist[0]);
      if (album) singerPath = path.join(singerPath, album);
      await createFolder(singerPath);
      const musicName = `${artist.join()} - ${name}`;

      if (
        !(await fs.existsSync(musicName + '.flac')) &&
        !(await fs.existsSync(musicName + '.mp3'))
      ) {
        const { musicInfo } = await getMusicDownloadInfo(music);
        if (musicInfo?.url) {
          const musicPath = path.join(
            singerPath,
            musicName + getUrlExtension(musicInfo.url)
          );
          console.log('music', musicPath);
          await downloadFile({
            url: musicInfo.url,
            filePath: musicPath,
          });
        }
      }

      const lyricPath = path.join(singerPath, musicName + '.lrc');
      if (!(await fs.existsSync(lyricPath))) {
        const lyric = await getLyric({ id: lyric_id, source });
        if (lyric.lyric) {
          console.log('lyric', lyricPath);
          await fs.writeFileSync(lyricPath, lyric.lyric, { encoding: 'utf-8' });
        }
      }

      // const coverUrl = album ? await downloadCover(music) : undefined;
      // if (coverUrl) {
      //   const coverPath = `${singerPath}/${album}${getUrlExtension(coverUrl)}`;
      //   console.log('cover', coverPath);
      //   await downloadFile({
      //     url: coverUrl,
      //     filePath: coverPath,
      //   });
      // }
      downloadedIds.push(id);
    }
  } catch (e) {
    console.log('download error: ', e);
  } finally {
    return downloadedIds;
  }
}
