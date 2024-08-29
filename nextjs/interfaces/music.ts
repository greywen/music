export type Source = 'tencent' | 'netease' | 'kugou';
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

export interface IQQMusicLyric {
  retcode: number;
  code: number;
  subcode: number;
  lyric: string;
  trans: string;
}

export interface IQQMusicSongInfo {
  info: Info;
  extras: Extras;
  track_info: Trackinfo;
}

interface Trackinfo {
  id: number;
  type: number;
  mid: string;
  name: string;
  title: string;
  subtitle: string;
  singer: Singer[];
  album: Album;
  mv: Mv;
  interval: number;
  isonly: number;
  language: number;
  genre: number;
  index_cd: number;
  index_album: number;
  time_public: string;
  status: number;
  fnote: number;
  file: File;
  pay: Pay;
  action: Action;
  ksong: Ksong;
  volume: Volume;
  label: string;
  url: string;
  bpm: number;
  version: number;
  trace: string;
  data_type: number;
  modify_stamp: number;
  pingpong: string;
  ppurl: string;
  tid: number;
  ov: number;
  sa: number;
  es: string;
  vs: string[];
  vi: number[];
  ktag: string;
  vf: number[];
}

interface Volume {
  gain: number;
  peak: number;
  lra: number;
}

interface Ksong {
  id: number;
  mid: string;
}

interface Action {
  switch: number;
  msgid: number;
  alert: number;
  icons: number;
  msgshare: number;
  msgfav: number;
  msgdown: number;
  msgpay: number;
  switch2: number;
  icon2: number;
}

interface Pay {
  pay_month: number;
  price_track: number;
  price_album: number;
  pay_play: number;
  pay_down: number;
  pay_status: number;
  time_free: number;
}

interface File {
  media_mid: string;
  size_24aac: number;
  size_48aac: number;
  size_96aac: number;
  size_192ogg: number;
  size_192aac: number;
  size_128mp3: number;
  size_320mp3: number;
  size_ape: number;
  size_flac: number;
  size_dts: number;
  size_try: number;
  try_begin: number;
  try_end: number;
  url: string;
  size_hires: number;
  hires_sample: number;
  hires_bitdepth: number;
  b_30s: number;
  e_30s: number;
  size_96ogg: number;
  size_360ra: any[];
  size_dolby: number;
  size_new: number[];
}

interface Mv {
  id: number;
  vid: string;
  name: string;
  title: string;
  vt: number;
}

interface Album {
  id: number;
  mid: string;
  name: string;
  title: string;
  subtitle: string;
  time_public: string;
  pmid: string;
}

interface Singer {
  id: number;
  mid: string;
  name: string;
  title: string;
  type: number;
  uin: number;
}

interface Extras {
  name: string;
  transname: string;
  subtitle: string;
  from: string;
  wikiurl: string;
}

interface Info {
  company: Company;
  genre: Company;
  lan: Company;
  pub_time: Company;
}

interface Company {
  title: string;
  type: string;
  content: Content[];
  pos: number;
  more: number;
  selected: string;
  use_platform: number;
}

interface Content {
  id: number;
  value: string;
  mid: string;
  type: number;
  show_type: number;
  is_parent: number;
  picurl: string;
  read_cnt: number;
  author: string;
  jumpurl: string;
  ori_picurl: string;
}
