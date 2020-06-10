export interface ITeslaApiRequestor {
  readonly credentials: {username: string, password};
  getRequest<T>(path: string, params?: any): Promise<T>;
  postRequest<T>(path: string, body?: any, params?: any): Promise<T>;
}
