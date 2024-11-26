import { Source } from './music';

export interface IGetMusicSearchPage {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  lyric_id: string;
  source: Source;
  checked?: boolean;
}

export interface IDownloadMusicParams {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  lyric_id: string;
  source: Source;
}

export interface IMusicSearchByGdParams {
  name: string;
  source: Source;
  count: number;
  pages: number;
}
