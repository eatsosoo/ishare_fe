export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

export interface BasicApiResult<T> {
  result: T;
  statusCode: number;
  message: string;
}
