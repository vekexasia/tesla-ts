import axios from 'axios';

import { ANDROID_USER_AGENT, API_HOST, API_URL, CLIENT_ID, CLIENT_SECRET } from './apiconstants';
import { ITeslaApiRequestor } from './ITeslaApiRequestor';
import { VehicleAPI } from './vehicleAPI';
import { BaseVehicle } from './types';

/**
 * Main class TeslaAPI Class
 */
export class TeslaAPI implements ITeslaApiRequestor{
  private token: string;
  private username: string;
  private password: string;

  public get credentials() {
    return { username: this.username, password: this.password };
  }

  public constructor(token: string)
  public constructor(username: string, password: string)
  public constructor(username: string, password?: string) {
    if (!password) {
      this.token = username;
    } else {
      this.username = username;
      this.password = password;
    }
  }

  private buildHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      "User-Agent": ANDROID_USER_AGENT
    }
  }

  public async vehicles(): Promise<VehicleAPI[]> {
    return this.getRequest<BaseVehicle[]>('/vehicles')
      .then((data) => data.map((item) => new VehicleAPI(this, item)))
  }


  private async auth(): Promise<void> {
    const res  = await axios.post<{access_token: string, token_type: string, expires_in: number, refresh_token: string}>(
      `${API_HOST}/oauth/token`,
       {
        email: this.username,
        password: this.password,
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }
    );
    if (res.status !== 200) {
      throw new Error(`Authorization failure: ${res.data}`);
    }
    this.token = res.data.access_token;
  }

  private async ensureAuth() {
    if (!this.token) {
      await this.auth();
    }
  }


  public async getRequest<T>(path: string, params?: any) {
    await this.ensureAuth();
    return axios.get<{response: T}>(`${API_URL}${path}`, {params, headers: this.buildHeaders()})
      .then((r) => r.data.response)
  }

  public async postRequest<T>(path: string, body?: any, params?: any) {
    await this.ensureAuth();
    return axios.post<{response: T}>(`${API_URL}${path}`, body || {}, {params: params || {}, headers: this.buildHeaders()})
      .then((r) => r.data.response);
  }

}
