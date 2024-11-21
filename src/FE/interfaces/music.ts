export type Source = 'tencent' | 'netease' | 'kuwo' | 'kugou';
export type MusicBr = 128 | 192 | 320 | 740 | 999;
export type CoverImgSize = 300 | 500;

export interface IMusic {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  lyric_id: string;
  source: Source;
}
