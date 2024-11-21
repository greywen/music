import { CoverImgSize, MusicBr, Source } from '../interfaces/music';
import { fetchJson } from '../utils/request';

interface IGetMusicListParams {
  name: string;
  source?: Source;
  pages?: number;
  count?: number;
}

interface IGetMusicListResult {
  id: string;
  name: string;
  artist: string[];
  album: string;
  pic_id: string;
  url_id: string;
  lyric_id: string;
  source: Source;
}

const SEARCH_MUSIC_API_URL = process.env.SEARCH_MUSIC_API_URL;
const DOWNLOAD_MUSIC_API_URL = process.env.DOWNLOAD_MUSIC_API_URL;

export async function getMusicList(params: IGetMusicListParams) {
  const { name, source = 'tencent', pages = 1, count = 20 } = params;
  const musics = await fetchJson<IGetMusicListResult[]>(
    `${SEARCH_MUSIC_API_URL}/api.php?types=search&source=${source}&name=${name}&count=${count}&pages=${pages}`
  );
  return musics.map((x) => {
    x.id = `${x.id}`;
    return x;
  });
}

interface IGetMusicInfoParams {
  id: string;
  source?: Source;
  br?: MusicBr;
}

interface IGetMusicInfoResult {
  url: string;
  size: number;
  br: MusicBr;
}

function formatMusicResult(inputString: string): IGetMusicInfoResult {
  const regex = /jQuery\((\{.*\})\)/;
  const match = inputString.match(regex);
  if (match && match[1]) {
    try {
      const jsonObject = JSON.parse(match[1]);
      return jsonObject;
    } catch (error) {
      console.error('Music Failed to parse JSON:', error);
      throw new Error('Music Failed to parse JSON');
    }
  } else {
    throw new Error('Music Failed to parse JSON');
  }
}

export async function getMusicInfo(params: IGetMusicInfoParams) {
  const { id, source = 'tencent', br = 999 } = params;
  const url = `${DOWNLOAD_MUSIC_API_URL}/api.php?callback=jQuery&types=url&source=${source}&id=${id}&br=${br}`;
  const response = await fetch(url, {
    headers: { Referer: 'https://music.gdstudio.xyz/' },
  });
  const dataString = await response.text();
  return formatMusicResult(dataString);
}

export async function getMusicInfoByApi(
  params: IGetMusicInfoParams
): Promise<IGetMusicInfoResult> {
  const { id, source = 'tencent', br = 999 } = params;
  const url = `${SEARCH_MUSIC_API_URL}/api.php?types=url&source=${source}&id=${id}&br=${br}`;
  const response = await fetch(url);
  return await response.json();
}

interface IGetCoverImgParams {
  id: string;
  source?: Source;
  size?: CoverImgSize;
}

interface IGetCoverImgResult {
  url: string;
}

export async function getCover(params: IGetCoverImgParams) {
  const { id, source = 'tencent', size = 300 } = params;
  return await fetchJson<IGetCoverImgResult>(
    `${SEARCH_MUSIC_API_URL}/api.php?types=pic&source=${source}&id=${id}&size=${size}`
  );
}

interface IGetLyricParams {
  id: string;
  source?: Source;
}

interface IGetLyricResult {
  lyric: string;
  tlyric: string;
}

export async function getLyric(params: IGetLyricParams) {
  const { id, source = 'tencent' } = params;
  return await fetchJson<IGetLyricResult>(
    `${SEARCH_MUSIC_API_URL}/api.php?types=lyric&source=${source}&id=${id}`
  );
}
