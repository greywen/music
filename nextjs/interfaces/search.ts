export interface IMusicSearchParams {
  query: string;
  count: number;
  pages: number;
}

export interface IGetMusicSearchResult {
  id: number;
  name: string;
  lyricId: number;
  artist: string;
  album: string;
  coverUrl: string;
}
