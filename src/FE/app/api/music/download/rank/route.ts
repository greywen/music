import { ITopResultSongList } from '@/interfaces/job';
import { NextRequest, NextResponse } from 'next/server';
import { getMusicList } from '@/services/gd';
import download from '@/utils/downloadMusic';
import { getTopList, TOP_IDS } from '@/services/qq';
import { Source } from '@/interfaces/music';

function removeSpecialCharacters(name: string) {
  let index = name.indexOf(' (');
  if (index === -1) index = name.length;
  return name.slice(0, index);
}

export async function POST(request: NextRequest) {
  try {
    const { ids, source } = (await request.json()) as {
      ids: number[];
      source: string;
    };
    if (!ids || ids.length === 0) {
      throw new Error('Ids is required');
    }

    if (!source) {
      throw new Error('Source is required');
    }

    const topIds = TOP_IDS.filter((id) => ids.includes(id));
    const topResult = await getTopList();

    if (topResult.code === 200) {
      const songList: ITopResultSongList[] = [];
      topResult.data
        .filter((x) => topIds.includes(x.id))
        .forEach((x) => {
          x.songList.forEach((s) => {
            if (!songList.find((sl) => s.songname == sl.songname))
              songList.push(s);
          });
        });

      console.log('Number of chart songs: ', songList.length);

      for (const item of songList) {
        const singerName = removeSpecialCharacters(item.singername);
        const songName = removeSpecialCharacters(item.songname);

        const musics = await getMusicList({
          name: songName,
          source: source as Source,
          count: 3,
        });
        console.log('Find the number of songs: ', musics.length);
        if (musics.length === 0) {
          continue;
        }

        let music = musics.find((x) => {
          const singer = x.artist.join('/');
          return (
            (singer == singerName || singer == item.singername) &&
            (x.name == songName || x.name == item.songname)
          );
        });

        if (!music) {
          console.log('Song not found');
          continue;
        }

        await download([music]);
      }
    }
    return NextResponse.json(topResult);
  } catch (err) {
    console.log('Download Daily Latest Leaderboard Quest Failed: ', err);
    return NextResponse.json({
      code: 400,
      message: 'Download Daily Latest Leaderboard Quest Failed',
    });
  }
}
