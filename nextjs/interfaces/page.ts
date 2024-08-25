export interface IPaging {
  count: number;
  pages: number;
}

export interface IPagingResult<T> {
  count: number;
  data: T[];
}
