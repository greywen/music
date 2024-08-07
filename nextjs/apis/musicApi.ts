import { useFetch } from "@/hooks/useFetch";

export const search = (params: IMusicSearchParams) => {
  const { query, count, pages } = params;
  const fetchService = useFetch();
  return fetchService.get<IMusicSearchResult[]>(
    `/api/music/search?query=${query}&pages=${pages}&count=${count}`
  );
};
