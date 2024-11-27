import { Source } from './music';

export interface ITopResult {
  id: number;
  songList: ITopResultSongList[];
}

export interface ITopResultSongList {
  singername: string;
  songname: string;
}

export interface IGetMusicListResult {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  url_id: string;
  lyric_id: string;
  source: Source;
}
