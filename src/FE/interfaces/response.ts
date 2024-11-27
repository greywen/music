export interface IResponse<T> {
  code: 200 | 400 | 500;
  message: string | undefined;
  data: T;
}
