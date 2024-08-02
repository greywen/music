'use client';
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './page.module.css';
import PlayListItem from '@/components/PlayList/PlayListItem';
import PlayListAction from '@/components/PlayList/PalyAction';
import PlayList from '@/components/PlayList/PlayList';
import { createContext, Dispatch } from 'react';
import { ActionType, useCreateReducer } from '@/hooks/useCreateReducer';

interface InitialState {
  searchLoading: boolean;
  playLoading: boolean;
  searchList: IMusic[];
  palyList: IMusic[];
  currentMusic: IMusic | undefined;
  nextMusic: IMusic[];
}

const initialState: InitialState = {
  searchLoading: false,
  playLoading: false,
  searchList: [],
  palyList: [],
  currentMusic: undefined,
  nextMusic: [],
};

interface ContextProps {
  state: InitialState;
  dispatch: Dispatch<ActionType<InitialState>>;
  handlePlay: (musicId: string) => void;
  handlePlayAll: (musicIds: string[]) => void;
  handlePause: () => void;
}

const Context = createContext<ContextProps>(undefined!);

export default function Home() {
  const contextValue = useCreateReducer<InitialState>({
    initialState,
  });

  const { state, dispatch } = contextValue;

  function handleSearch(value: string) {}

  function handlePlay(musicId: string) {}
  function handlePlayAll(musicIds: string[]) {}
  function handlePause() {}

  const data = [
    {
      name: '晴天',
      artist: '周杰伦',
    },
    {
      name: '搁浅',
      artist: '周杰伦',
    },
    {
      name: '一路向北',
      artist: '周杰伦',
    },
    {
      name: '兰亭序',
      artist: '周杰伦',
    },
    {
      name: '稻香',
      artist: '周杰伦',
    },
    {
      name: '枫',
      artist: '周杰伦',
    },
    {
      name: '夜曲',
      artist: '周杰伦',
    },
    {
      name: '七里香',
      artist: '周杰伦',
    },
    {
      name: '青花瓷',
      artist: '周杰伦',
    },
    {
      name: '反方向的钟',
      artist: '周杰伦',
    },
    {
      name: '告白气球',
      artist: '周杰伦',
    },
    {
      name: '花海',
      artist: '周杰伦',
    },
    {
      name: '红尘客栈',
      artist: '周杰伦',
    },
    {
      name: '我落泪情绪零碎',
      artist: '周杰伦',
    },
    {
      name: '蒲公英的约定',
      artist: '周杰伦',
    },
    {
      name: '退后',
      artist: '周杰伦',
    },
    {
      name: '我是如此相信',
      artist: '周杰伦',
    },
    {
      name: '半岛铁盒',
      artist: '周杰伦',
    },
    {
      name: '爱在西元前',
      artist: '周杰伦',
    },
  ];

  return (
    <main className={styles.container}>
      <Context.Provider
        value={{ ...contextValue, handlePlay, handlePlayAll, handlePause }}
      >
        <SearchBar onSearch={handleSearch} />
        <PlayListAction />
        <PlayList>
          {data.map((x) => (
            <PlayListItem
              key={x.name}
              title={x.name}
              description={`${x.artist} - ${x.name}`}
            />
          ))}
        </PlayList>
      </Context.Provider>
    </main>
  );
}
