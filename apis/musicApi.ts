import { useFetch } from '@/hooks/useFetch';
import {
  IMusicSearchByGdParams,
  IDownloadMusicParams,
  IGetMusicSearchPage,
} from '@/interfaces/search';

export const searchByGd = (params: IMusicSearchByGdParams) => {
  const { name, source, count, pages } = params;
  const fetchService = useFetch();
  return fetchService.get<IGetMusicSearchPage[]>(
    `/api/gd/search?name=${name}&pages=${pages}&count=${count}&source=${source}`
  );
};

export const downloadMusic = (musicList: IDownloadMusicParams[]) => {
  const fetchService = useFetch();
  return fetchService.post<string[]>(`/api/gd/download`, { body: musicList });
};
