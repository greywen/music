import { useFetch } from "@/hooks/useFetch";
import { IMusicSearchParams, IMusicSearchResult } from "@/interfaces/search";

export const search = (params: IMusicSearchParams) => {
  const { query, count, pages } = params;
  const fetchService = useFetch();
  return fetchService.get<IMusicSearchResult[]>(
    `/api/music/search?query=${query}&pages=${pages}&count=${count}`
  );
};
