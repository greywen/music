import { useFetch } from '@/utils/request';

export enum Source {
  tencent = 'tencent',
  netease = 'netease',
  kugou = 'kugou',
}

export type MusicBr = 128 | 192 | 320 | 740 | 999;
export type CoverImgSize = 300 | 500;

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

export async function getMusicList(params: IGetMusicListParams) {
  const { name, source = Source.tencent, pages = 1, count = 20 } = params;
  const fetchService = useFetch();
  return await fetchService.get<IGetMusicListResult>(
    `https://music-api.gdstudio.xyz/api.php?types=search&source=${source}&name=${name}&count=${count}&pages=${pages}`
  );
}

interface IGetMusicInfoParams {
  id: string;
  source?: Source;
  br?: MusicBr;
}

interface IGetMusicInfoResult {
  url: string;
  size: number;
  br?: MusicBr;
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
  const { id, source = Source.tencent, br = 320 } = params;
  const fetchService = useFetch();
  const url = `https://music-api-cn.gdstudio.xyz:22443/api.php?callback=jQuery&types=url&source=${source}&id=${id}&br=${br}`;
  const dataString = await fetchService.get<string>(url, {
    headers: {
      'Content-type': 'text/plain',
    },
  });
  return formatMusicResult(dataString);
}

interface IGetCoverImgParams {
  id: string;
  source?: Source;
  size?: CoverImgSize;
}

interface IGetCoverImgResult {
  url: string;
}

export async function getCoverImg(params: IGetCoverImgParams) {
  const { id, source = Source.tencent, size = 300 } = params;
  const fetchService = useFetch();
  return await fetchService.get<IGetCoverImgResult>(
    `https://music-api.gdstudio.xyz/api.php?types=pic&source=${source}&id=${id}&size=${size}`
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
  const { id, source = Source.tencent } = params;
  const fetchService = useFetch();
  return await fetchService.get<IGetLyricResult>(
    `https://music-api.gdstudio.xyz/api.php?types=lyric&source=${source}&id=${id}`
  );
}
