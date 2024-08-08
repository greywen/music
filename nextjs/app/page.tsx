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
import { isEmpty } from '@/utils/common';

interface InitialState {
  searchLoading: boolean;
  playLoading: boolean;
  searchList: IMusicSearchResult[];
  playList: IMusicSearchResult[];
  currentMusic: IMusicSearchResult;
}

const initialState: InitialState = {
  searchLoading: false,
  playLoading: false,
  searchList: [],
  playList: [],
  currentMusic: {} as IMusicSearchResult,
};

let howler: Howl;
export default function Home() {
  const [searchPaging, setSearchPaging] = useState<IPaging>({
    pages: 1,
    count: 20,
  });
  const [searchList, setSearchList] = useState<IMusicSearchResult[]>([]);
  const [playList, setPlayList] = useState<IMusicSearchResult[]>([]);
  const [currentMusic, setCurrentMusic] = useState<IMusicSearchResult>(
    {} as IMusicSearchResult
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [playLoading, setPlayLoading] = useState<boolean>(false);

  function nextMusic() {
    const index = playList.findIndex((x) => x.id === currentMusic.id);
    if (index > 0 && index < playList.length) {
      setCurrentMusic(playList[index + 1]);
    } else {
      howler.pause();
    }
  }

  function prevMusic() {
    const index = playList.findIndex((x) => x.id === currentMusic.id);
    if (index != 0) {
      setCurrentMusic(playList[index - 1]);
    } else {
    }
  }

  useEffect(() => {
    if (!isEmpty(currentMusic)) {
      howler = new Howl({
        src: 'files/music?id=' + currentMusic.id,
        format: ['mp3'],
        html5: true,
        autoplay: true,
        volume: 0.5,
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
        howler.play();
      });

      howler.on('end', () => {
        nextMusic();
      });
    }
  }, [currentMusic]);

  async function handleSearch(value: string) {
    setSearchLoading(true);
    const data = await search({ ...searchPaging, query: value });
    setSearchList(data);
    setSearchLoading(false);
  }

  function handlePlay(musicId: number) {}
  function handlePlayAll() {
    setPlayLoading(true);
    setPlayList(searchList);
    setCurrentMusic(searchList[0]);
  }

  function handleNext() {
    nextMusic();
  }
  function handlePause() {}

  return (
    <main className={styles.container}>
      {!isEmpty(currentMusic) && (
        <PlayBar
          onNext={handleNext}
          title={currentMusic.name}
          description={`${currentMusic.artist} - ${currentMusic.name}`}
        />
      )}
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
    </main>
  );
}
