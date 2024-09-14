import { useFetch } from '@/hooks/useFetch';
import { IGetLyricResult } from '@/interfaces/lyric';
import { IPagingResult } from '@/interfaces/page';
import { IMusicSearchParams, IGetMusicSearchResult } from '@/interfaces/search';

export const search = (params: IMusicSearchParams) => {
  const { query, count, pages } = params;
  const fetchService = useFetch();
  return fetchService.get<IPagingResult<IGetMusicSearchResult>>(
    `/api/music/search?query=${query}&pages=${pages}&count=${count}`
  );
};

export const randomMusic = () => {
  const fetchService = useFetch();
  return fetchService.get<IGetMusicSearchResult[]>(
    `/api/music/randomly?count=${100}`
  );
};

export const getMusicPlayUrl = (id: number) => {
  const fetchService = useFetch();
  return fetchService.get<{ url: string }>(`/api/music/url?id=${id}`);
};

export const getMusicLyric = (id: number) => {
  const fetchService = useFetch();
  return fetchService.get<IGetLyricResult[]>(`/api/music/lyric?id=${id}`);
};
