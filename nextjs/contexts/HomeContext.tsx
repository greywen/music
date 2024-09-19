import { PlayStatus } from '@/constants/common';
import { IGetMusicSearchResult } from '@/interfaces/search';
import { createContext } from 'react';

export interface InitialState {
  howler?: Howl;
  currentMusic?: IGetMusicSearchResult;
  playList: IGetMusicSearchResult[];
  playStatus: PlayStatus;
  seek: number;
}

interface ContextProps {
  state: InitialState;
}

const HomeContext = createContext<ContextProps>(undefined!);
export { HomeContext };
