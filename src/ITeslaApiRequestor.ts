export interface ITeslaApiRequestor {
  readonly token: string;
  getRequest<T>(path: string, params?: any): Promise<T>;
  postRequest<T>(path: string, body?: any, params?: any): Promise<T>;
}
