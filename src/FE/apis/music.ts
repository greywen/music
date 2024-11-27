import { useFetch } from '@/hooks/useFetch';
import {
  IMusicSearchParams,
  IDownloadMusicParams,
  IGetMusicSearchPage,
} from '@/interfaces/search';

export const search = (params: IMusicSearchParams) => {
  const { name, source, count, pages } = params;
  const fetchService = useFetch();
  return fetchService.get<IGetMusicSearchPage[]>(
    `/api/music/search?name=${name}&pages=${pages}&count=${count}&source=${source}`
  );
};

export const download = (musicList: IDownloadMusicParams[]) => {
  const fetchService = useFetch();
  return fetchService.post<string[]>(`/api/music/download`, { body: musicList });
};
