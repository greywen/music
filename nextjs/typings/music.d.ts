type Source = 'tencent' | 'netease' | 'kugou';
type MusicBr = 128 | 192 | 320 | 740 | 999;
type CoverImgSize = 300 | 500;

interface IMusic {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  lyric_id: string;
  source: Source;
}
