'use client';
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './page.module.css';
import PlayListItem from '@/components/PlayList/PlayListItem';
import PlayListAction from '@/components/PlayList/PalyAction';
import PlayList from '@/components/PlayList/PlayList';
import { useCallback, useEffect, useRef, useState } from 'react';
import PlayBar from '@/components/PlayBar';
import { Howl, Howler } from 'howler';
import { search } from '@/apis/musicApi';
import { IMusicSearchParams, IMusicSearchResult } from '@/interfaces/search';
import PlayDrawer from '@/components/PlayDrawer';
import PlayListLoading from '@/components/PlayList/PlayListLoading';

let howler: Howl;
export default function Home() {
  const initSearchParams = { query: '', pages: 1, count: 50 };
  const [searchParams, setSearchParams] =
    useState<IMusicSearchParams>(initSearchParams);
  const [showMore, setShowMore] = useState(true);
  const [searchList, setSearchList] = useState<IMusicSearchResult[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const [playList, setPlayList] = useState<IMusicSearchResult[]>([]);
  const [currentMusic, setCurrentMusic] = useState<IMusicSearchResult | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [playLoading, setPlayLoading] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playDrawerOpen, setPlayDrawer] = useState<boolean>(false);

  const moreRef = useCallback(
    (node: HTMLDivElement) => {
      // if (searchLoading || !searchParams.query) return;
      // if (observer.current) observer.current.disconnect();
      // observer.current = new IntersectionObserver((entries) => {
      //   if (entries[0].isIntersecting) {
      //     const pages = searchParams.pages + 1;
      //     setSearchParams((prev) => ({ ...prev, pages }));
      //     setSearchLoading(true);
      //     search({
      //       ...searchParams,
      //       pages,
      //     }).then((data) => {
      //       setShowMore(data.length > initSearchParams.count);
      //       setSearchList((prev) => [...prev, ...data]);
      //       setSearchLoading(false);
      //     });
      //   }
      // });
      // if (node) observer.current.observe(node);
    },
    [searchLoading]
  );

  function setMetadata() {
    if ('mediaSession' in navigator && currentMusic) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.name,
        artist: currentMusic.artist,
        album: currentMusic.album,
        artwork: [
          {
            src: '/files/cover?id=' + currentMusic.coverId,
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
      howler = new Howl({
        src: 'files/music?id=' + currentMusic.id,
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
    }
  }, [currentMusic]);

  async function handleSearch(value: string) {
    if (!value) {
      setSearchParams(initSearchParams);
      setSearchList([]);
      return;
    }
    setSearchParams((prev) => ({ ...prev, query: value }));
    setSearchLoading(true);
    search({
      ...searchParams,
      query: value,
    }).then((data) => {
      setSearchList(data);
      setShowMore(data.length > initSearchParams.count);
      setSearchLoading(false);
    });
  }

  function handlePlaySingle(musicId: number) {
    let music = searchList.find((x) => x.id === musicId);
    if (music) {
      setPlayList(searchList);
      setCurrentMusic(music);
    }
  }

  function handlePlayAll() {
    setPlayList(searchList);
    setCurrentMusic(searchList[0]);
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

  return (
    <main className={styles.container}>
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
      <SearchBar searching={searchLoading} onSearch={handleSearch} />
      {/* {searchList.length > 0 && <PlayListAction onPlayAll={handlePlayAll} />} */}
      <PlayList>
        {searchList.map((x) => (
          <PlayListItem
            key={x.id}
            title={x.name}
            description={`${x.artist} - ${x.name}`}
            onClickLeft={() => handlePlaySingle(x.id)}
          />
        ))}
        {searchLoading && <PlayListLoading />}
        <div ref={moreRef} style={{ height: 48 }}></div>
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
