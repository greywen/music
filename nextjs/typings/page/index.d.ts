interface IPaging {
  count: number;
  pages: number;
}

interface IMusicSearchParams {
  query: string;
  count: number;
  pages: number;
}

interface IMusicSearchResult {
  id: number;
  name: string;
  artist: string;
  album: string;
  coverId: number;
}
