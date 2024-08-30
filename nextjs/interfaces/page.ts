export interface IPaging {
  count: number;
  pages: number;
}

export interface IPagingResult<T> {
  total: number;
  list: T[];
}
