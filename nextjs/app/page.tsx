'use client';
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './page.module.css';
import PlayListItem from '@/components/PlayList/PlayListItem';
import PlayListAction from '@/components/PlayList/PalyAction';
import PlayList from '@/components/PlayList/PlayList';
import { createContext, Dispatch, useEffect, useState } from 'react';
import { ActionType, useCreateReducer } from '@/hooks/useCreateReducer';
import PlayBar from '@/components/PlayBar';
import { Howl, Howler } from 'howler';
import { search } from '@/apis/musicApi';

interface InitialState {
  searchLoading: boolean;
  playLoading: boolean;
  searchList: IMusicSearchResult[];
  palyList: IMusicSearchResult[];
  currentMusic: IMusicSearchResult;
  nextMusicList: IMusicSearchResult[];
}

const initialState: InitialState = {
  searchLoading: false,
  playLoading: false,
  searchList: [],
  palyList: [],
  currentMusic: {} as IMusicSearchResult,
  nextMusicList: [],
};

interface ContextProps {
  state: InitialState;
  dispatch: Dispatch<ActionType<InitialState>>;
}

const Context = createContext<ContextProps>(undefined!);

export default function Home() {
  const contextValue = useCreateReducer<InitialState>({
    initialState,
  });
  const [searchPaging, setSearchPaging] = useState<IPaging>({
    pages: 1,
    count: 20,
  });
  const {
    state: {
      currentMusic,
      playLoading,
      nextMusicList,
      searchLoading,
      searchList,
    },
    dispatch,
  } = contextValue;

  useEffect(() => {
    if (playLoading) {
      let sound = new Howl({
        src: '',
        html5: true,
        autoplay: true,
        volume: 0.5,
      });

      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', function () {
          sound.play();
        });
        navigator.mediaSession.setActionHandler('pause', function () {
          sound.pause();
        });
      }

      sound.once('load', () => {
        sound.play();
      });

      sound.on('end', () => {
        const index = nextMusicList.findIndex((x) => x.id === currentMusic?.id);
        if (index > 0 && index < nextMusicList.length) {
          dispatch({ field: 'currentMusic', value: nextMusicList[index] });
        } else {
          sound.pause();
        }
      });
    }
  }, [currentMusic, playLoading]);

  async function handleSearch(value: string) {
    dispatch({ field: 'searchLoading', value: true });
    const data = await search({ ...searchPaging, query: value });
    dispatch({ field: 'searchList', value: data });
    dispatch({ field: 'searchLoading', value: false });
  }

  function handlePlay(musicId: number) {}
  function handlePlayAll() {
    dispatch({ field: 'playLoading', value: true });
    dispatch({ field: 'palyList', value: searchList });
    dispatch({ field: 'nextMusicList', value: searchList });
    dispatch({ field: 'currentMusic', value: searchList[0] });
    dispatch({ field: 'playLoading', value: false });
  }
  function handlePause() {}

  return (
    <main className={styles.container}>
      <Context.Provider value={{ ...contextValue }}>
        <PlayBar
          title={currentMusic.name}
          description={`${currentMusic.artist} - ${currentMusic.name}`}
        />
        <SearchBar searching={searchLoading} onSearch={handleSearch} />
        {searchList.length > 0 && <PlayListAction onPlayAll={handlePlayAll} />}
        <PlayList>
          {searchList.map((x) => (
            <PlayListItem
              key={x.id}
              title={x.name}
              description={`${x.artist} - ${x.name}`}
              onClickLeft={() => handlePlay(x.id)}
            />
          ))}
        </PlayList>
      </Context.Provider>
    </main>
  );
}
