'use client';
import SearchBar from '@/components/SearchBar/SearchBar';
import PlayListItem from '@/components/PlayList/PlayListItem';
import PlayList from '@/components/PlayList/PlayList';
import { createContext, MutableRefObject, useEffect, useState } from 'react';
import PlayBar from '@/components/PlayBar';
import { Howl, Howler } from 'howler';
import { getMusicPlayUrl, randomMusic, search } from '@/apis/musicApi';
import { IMusicSearchParams, IGetMusicSearchResult } from '@/interfaces/search';
import PlayDrawer from '@/components/PlayDrawer';
import PlayListLoading from '@/components/PlayList/PlayListLoading';
import { useCreateReducer } from '@/hooks/useCreateReducer';

export enum PlayStatus {
  playing = 1,
  paused = 2,
  ended = 3,
  waiting = 4,
  error = 5,
  none = 6,
}

interface InitialState {
  howler?: Howl;
  currentMusic?: IGetMusicSearchResult;
  playList: IGetMusicSearchResult[];
  playStatus: PlayStatus;
  seek: number;
}

const initialState: InitialState = {
  howler: undefined,
  currentMusic: undefined,
  playList: [],
  playStatus: PlayStatus.none,
  seek: 0,
};

interface ContextProps {
  state: InitialState;
}

const HomeContext = createContext<ContextProps>(undefined!);
let playInterval: NodeJS.Timeout;

export default function Home() {
  const contextValue = useCreateReducer<InitialState>({
    initialState,
  });
  const {
    state: { howler, currentMusic, playList },
    dispatch,
  } = contextValue;

  const initSearchParams = { query: '', pages: 1, count: 50 };
  const [searchParams, setSearchParams] =
    useState<IMusicSearchParams>(initSearchParams);
  const [totalCount, setTotalCount] = useState(0);
  const [searchList, setSearchList] = useState<IGetMusicSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
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
    setPlayStatus(PlayStatus.waiting);
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

  function playMusic() {
    console.log('howler', howler);
    howler?.play();
    setPlayStatus(PlayStatus.playing);
  }

  function pauseMusic() {
    howler?.pause();
    clearPlayInterval();
    setPlayStatus(PlayStatus.paused);
  }

  function setPlayStatus(value: PlayStatus) {
    dispatch({ field: 'playStatus', value });
  }

  function setCurrentMusic(value: IGetMusicSearchResult) {
    dispatch({ field: 'currentMusic', value });
  }

  function setPlayList(value: IGetMusicSearchResult[]) {
    dispatch({ field: 'playList', value });
  }

  function unloadMusic() {
    clearPlayInterval();
    howler?.unload();
  }

  function clearPlayInterval() {
    playInterval && clearInterval(playInterval);
  }

  useEffect(() => {
    if (howler) {
      howler.play();
      setPlayStatus(PlayStatus.playing);
    }
  }, [howler]);

  useEffect(() => {
    if (currentMusic) {
      unloadMusic();
      getMusicPlayUrl(currentMusic.id).then((data) => {
        let _howler = new Howl({
          src: data.url,
          format: ['mp3'],
          html5: true,
          autoplay: false,
          onplay: function () {
            playInterval = setInterval(function () {
              dispatch({ field: 'seek', value: _howler.seek() });
            }, 100);
          },
        });
        dispatch({ field: 'howler', value: _howler });

        if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', function () {
            playMusic();
          });
          navigator.mediaSession.setActionHandler('pause', function () {
            pauseMusic();
          });
          navigator.mediaSession.setActionHandler('previoustrack', function () {
            prevMusic();
          });
          navigator.mediaSession.setActionHandler('nexttrack', function () {
            nextMusic();
          });
        }

        _howler.on('load', function () {
          setMetadata();
        });

        _howler.on('end', () => {
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

  function handlePlayList(musicId: number) {
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
    pauseMusic();
  }

  function handlePlay() {
    playMusic();
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
    <HomeContext.Provider value={{ ...contextValue }}>
      <main className='max-w-[400px] mx-auto py-[0.8125rem] md:max-w-[768px]'>
        <PlayBar
          onNext={handleNext}
          onPause={handlePause}
          onPlay={handlePlay}
          onClickLeft={() => {
            setPlayDrawer(true);
          }}
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
              onClickLeft={() => handlePlayList(x.id)}
            />
          ))}
          {searchLoading && <PlayListLoading />}
        </PlayList>
        <PlayDrawer
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
    </HomeContext.Provider>
  );
}

export { initialState, HomeContext };
