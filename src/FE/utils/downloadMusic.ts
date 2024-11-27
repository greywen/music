import path from 'path';
import { IMusic, MusicBr } from '../interfaces/music';
import {
  getCover,
  getLyric,
  getMusicInfo,
  getMusicInfoByApi,
} from '../services/gd';
import createFolder from '../utils/createFolder';
import { downloadFile, getUrlExtension } from '../utils/downloadFile';
import fs from 'fs';
import { fetchJson } from './request';

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

const METADATA_SERVER_URL = process.env.METADATA_SERVER_URL;
async function setMusicMetadata(
  filePath: string,
  coverUrl: string,
  metadata: {
    title?: string;
    album?: string;
    artist?: string[];
    date?: string;
  }
) {
  return await fetchJson<{ code: number; text: string }>(
    `${METADATA_SERVER_URL}/metadata/update`,
    {
      method: 'POST',
      body: {
        filePath,
        coverUrl,
        metadata,
      },
    }
  );
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
        !(await fs.existsSync(path.join(singerPath, musicName + '.flac'))) &&
        !(await fs.existsSync(path.join(singerPath, musicName + '.mp3')))
      ) {
        const { musicInfo } = await getMusicDownloadInfo(music);
        if (musicInfo?.url) {
          const musicPath = path.join(
            singerPath,
            musicName + getUrlExtension(musicInfo.url)
          );
          console.log('Song Path:', musicPath);
          await downloadFile({
            url: musicInfo.url,
            filePath: musicPath,
          });

          const coverUrl = album ? await downloadCover(music) : undefined;
          if (coverUrl && METADATA_SERVER_URL) {
            const data = await setMusicMetadata(musicPath, coverUrl, {
              title: name,
              album,
              artist,
            });
            if (data?.code === 200) {
              console.log('Metadata written successfully');
            } else {
              console.log('Metadata write failure: ', JSON.stringify(data));
            }
          }
        }
      } else {
        console.log('The music already exists: ', musicName);
      }

      const lyricPath = path.join(singerPath, musicName + '.lrc');
      if (!(await fs.existsSync(lyricPath))) {
        const lyric = await getLyric({ id: lyric_id, source });

        if (lyric.lyric) {
          console.log('Lyrics Path: ', lyricPath);
          await fs.writeFileSync(lyricPath, lyric.lyric, { encoding: 'utf-8' });
        } else {
          console.log('Lyrics not found');
        }
      } else {
        console.log('The lyrics already exists: ', lyricPath);
      }
      downloadedIds.push(id);
    }
  } catch (err) {
    console.log('Download failed: ', err);
  } finally {
    return downloadedIds;
  }
}
