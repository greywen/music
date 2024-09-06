import { useFetch } from '@/hooks/useFetch';
import { IPagingResult } from '@/interfaces/page';
import { IMusicSearchParams, IMusicSearchResult } from '@/interfaces/search';

export const search = (params: IMusicSearchParams) => {
  const { query, count, pages } = params;
  const fetchService = useFetch();
  return fetchService.get<IPagingResult<IMusicSearchResult>>(
    `/api/music/search?query=${query}&pages=${pages}&count=${count}`
  );
};

export const randomMusic = () => {
  const fetchService = useFetch();
  return fetchService.get<IMusicSearchResult[]>(
    `/api/music/randomly?count=${100}`
  );
};

export const getMusicPlayUrl = (id: number) => {
  const fetchService = useFetch();
  return fetchService.get<{ url: string }>(`/api/music/url?id=${id}`);
};
