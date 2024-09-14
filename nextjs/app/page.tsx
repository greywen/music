'use client';
import SearchBar from '@/components/SearchBar/SearchBar';
import PlayListItem from '@/components/PlayList/PlayListItem';
import PlayList from '@/components/PlayList/PlayList';
import { useEffect, useState } from 'react';
import PlayBar from '@/components/PlayBar';
import { Howl, Howler } from 'howler';
import { getMusicPlayUrl, randomMusic, search } from '@/apis/musicApi';
import { IMusicSearchParams, IGetMusicSearchResult } from '@/interfaces/search';
import PlayDrawer from '@/components/PlayDrawer';
import PlayListLoading from '@/components/PlayList/PlayListLoading';

let howler: Howl;
export default function Home() {
  const initSearchParams = { query: '', pages: 1, count: 50 };
  const [searchParams, setSearchParams] =
    useState<IMusicSearchParams>(initSearchParams);
  const [totalCount, setTotalCount] = useState(0);
  const [searchList, setSearchList] = useState<IGetMusicSearchResult[]>([]);
  const [playList, setPlayList] = useState<IGetMusicSearchResult[]>([]);
  const [currentMusic, setCurrentMusic] = useState<IGetMusicSearchResult | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [playLoading, setPlayLoading] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playDrawerOpen, setPlayDrawer] = useState<boolean>(false);

  function handleClearSearch() {
    setSearchList([]);
  }

  function setMetadata() {
    if ('mediaSession' in navigator && currentMusic) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.name,
        artist: currentMusic.artist,
        album: currentMusic.album,
        artwork: [
          {
            src: currentMusic.coverUrl,
            sizes: '500x500',
            type: 'image/png',
          },
        ],
      });
    }
  }

  function nextMusic() {
    const index = playList.findIndex((x) => x.id === currentMusic!.id);
    const playListCount = playList.length;
    if (index >= 0 && index < playListCount - 1) {
      setCurrentMusic(playList[index + 1]);
    } else {
    }
  }

  function prevMusic() {
    const index = playList.findIndex((x) => x.id === currentMusic!.id);
    if (index != 0) {
      setCurrentMusic(playList[index - 1]);
    } else {
    }
  }

  useEffect(() => {
    if (currentMusic) {
      howler?.unload();
      getMusicPlayUrl(currentMusic.id).then((data) => {
        howler = new Howl({
          src: data.url,
          format: ['mp3'],
          html5: true,
        });

        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', function () {
            howler.play();
          });
          navigator.mediaSession.setActionHandler('pause', function () {
            howler.pause();
          });
          navigator.mediaSession.setActionHandler('previoustrack', function () {
            prevMusic();
          });
          navigator.mediaSession.setActionHandler('nexttrack', function () {
            nextMusic();
          });
        }

        howler.on('load', () => {
          setMetadata();
          handlePlay();
        });

        howler.on('end', () => {
          setPlaying(false);
          nextMusic();
        });
      });
    }
  }, [currentMusic]);

  async function handleSearch(value: string) {
    setSearchList([]);
    setSearchParams(initSearchParams);
    if (!value) {
      return;
    }
    await sendSearch({ ...initSearchParams, query: value });
  }

  async function sendSearch(params: IMusicSearchParams, isNewSearch = true) {
    setSearchParams(params);
    setSearchLoading(true);
    search({
      ...params,
    }).then((data) => {
      setSearchList((prev) =>
        !isNewSearch ? [...prev, ...data.data] : data.data
      );
      setTotalCount(data.count);

      setSearchLoading(false);
    });
  }

  async function handleScrollToBottom() {
    if (searchList.length === totalCount || searchLoading) return;
    const params = { ...searchParams, pages: searchParams.pages + 1 };
    await sendSearch(params, false);
  }

  function handlePlaySingle(musicId: number) {
    let music = searchList.find((x) => x.id === musicId);
    if (music) {
      setPlayList(searchList);
      setCurrentMusic(music);
    }
  }

  function handleNext() {
    nextMusic();
  }

  function handlePause() {
    setPlaying(false);
    howler.pause();
  }

  function handlePlay() {
    setPlaying(true);
    howler.play();
  }

  function handlePrev() {
    prevMusic();
  }

  function getRandomMusic() {
    randomMusic().then((data) => {
      if (data.length > 0) {
        setPlayList(data);
        setCurrentMusic(data[0]);
      }
    });
  }

  return (
    <main className='max-w-[400px] mx-auto py-[0.8125rem] md:max-w-[768px]'>
      <PlayBar
        onNext={handleNext}
        onPause={handlePause}
        onPlay={handlePlay}
        onClickLeft={() => {
          setPlayDrawer(true);
        }}
        playing={playing}
        music={currentMusic}
      />
      <SearchBar
        searching={searchLoading}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />
      {searchList.length === 0 && (
        <div
          className='flex justify-center mt-4 text-green-800'
          onClick={getRandomMusic}
        >
          随机音乐100首
        </div>
      )}
      <PlayList onScrollToBottom={handleScrollToBottom}>
        {searchList.map((x) => (
          <PlayListItem
            key={x.id}
            title={x.name}
            description={`${x.artist} - ${x.album}`}
            onClickLeft={() => handlePlaySingle(x.id)}
          />
        ))}
        {searchLoading && <PlayListLoading />}
      </PlayList>
      <PlayDrawer
        playing={playing}
        music={currentMusic!}
        open={playDrawerOpen}
        onOpenChange={() => {
          setPlayDrawer(false);
        }}
        onPrev={handlePrev}
        onNext={handleNext}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </main>
  );
}
