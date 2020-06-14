import axios from "axios";

import { ANDROID_USER_AGENT, API_HOST, API_URL, CLIENT_ID, CLIENT_SECRET } from "./apiconstants";
import { ITeslaApiRequestor } from "./ITeslaApiRequestor";
import { BaseVehicle } from "./types";
import { VehicleAPI } from "./vehicleAPI";

/**
 * Main class TeslaAPI Class
 */
export class TeslaAPI implements ITeslaApiRequestor {

  /**
   * Use this to get the token or the current set username and password.
   */
  public get credentials() {
    return { username: this.username, password: this.password, token: this.token };
  }

  private token: string;
  private username: string;
  private password: string;

  public constructor(token: string)
  // tslint:disable-next-line:unified-signatures
  public constructor(username: string, password: string)
  public constructor(usernameOrToken: string, password?: string) {
    if (!password) {
      this.token = usernameOrToken;
    } else {
      this.username = usernameOrToken;
      this.password = password;
    }
  }

  /**
   * Lists vehicles.
   */
  public async vehicles(): Promise<VehicleAPI[]> {
    return this.getRequest<BaseVehicle[]>("/vehicles")
      .then((data) => data.map((item) => new VehicleAPI(this, item)));
  }

  public async getRequest<T>(path: string, params?: any) {
    await this.ensureAuth();
    return axios.get<{ response: T }>(`${API_URL}${path}`, { params, headers: this.buildHeaders() })
      .then((r) => r.data.response);
  }

  public async postRequest<T>(path: string, body?: any, params?: any) {
    await this.ensureAuth();
    return axios.post<{ response: T }>(`${API_URL}${path}`,
      body || {}, { params: params || {}, headers: this.buildHeaders() })
      .then((r) => r.data.response);
  }

  private buildHeaders() {
    return {
      "Authorization": `Bearer ${this.token}`,
      "User-Agent"   : ANDROID_USER_AGENT,
    };
  }

  private async auth(): Promise<void> {
    const res = await axios
      .post<{ access_token: string, token_type: string, expires_in: number, refresh_token: string }>(
        `${API_HOST}/oauth/token`,
        {
          client_id    : CLIENT_ID,
          client_secret: CLIENT_SECRET,
          email        : this.username,
          grant_type   : "password",
          password     : this.password,
        },
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

}
