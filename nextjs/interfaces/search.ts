export interface IMusicSearchParams {
  query: string;
  count: number;
  pages: number;
}

export interface IMusicSearchResult {
  id: number;
  name: string;
  artist: string;
  album: string;
  coverId: number;
}
