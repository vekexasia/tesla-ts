import axios from "axios";

import { ANDROID_USER_AGENT, API_HOST, API_URL, CLIENT_ID, CLIENT_SECRET } from "./constants";
import { ITeslaApiRequestor } from "./ITeslaApiRequestor";
import { PowerwallAPI, PowerwallProduct } from "./powerwalls";
import { BaseVehicle, VehicleAPI, VehicleProduct } from "./vehicles";

/**
 * Main class TeslaAPI Entry point for this library.
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

  public async products(): Promise<Array<VehicleAPI | PowerwallAPI>> {
    return this.getRequest<Array<VehicleProduct | PowerwallProduct>>("/products")
      .then((data) => {
        const toRet = [];
        for (const dataEntry of data) {
          // @ts-ignore
          if (dataEntry.resource_type === "battery") {
            toRet.push(new PowerwallAPI(this, dataEntry as PowerwallProduct));
          } else {
            toRet.push(new VehicleAPI(this, dataEntry as BaseVehicle));
          }
        }
        return toRet;
      });
  }

  public async powerwalls(): Promise<PowerwallAPI[]> {
    const products = await this.products();
    return products.filter((p) => p instanceof PowerwallAPI) as PowerwallAPI[];
  }

  /**
   * Create a raw authenticated HTTP.GET request to Tesla.
   * You can use it if this library misses some API calls.
   * @param path the endpoint path
   * @param params the parameters to pass to axios (see axios documentation)
   */
  public async getRequest<T>(path: string, params?: any) {
    await this.ensureAuth();
    return axios.get<{ response: T }>(`${API_URL}${path}`, { params, headers: this.buildHeaders() })
      .then((r) => r.data.response);
  }

  /**
   * Creates a raw authenticated HTTP.POST request to Tesla
   * You can use it if this library misses some API calls.
   * @param path the endpoint path
   * @param body the request body
   * @param params
   */
  public async postRequest<T>(path: string, body?: any, params?: any) {
    await this.ensureAuth();
    return axios.post<{ response: T }>(`${API_URL}${path}`,
      body || {}, { params: params || {}, headers: this.buildHeaders() })
      .then((r) => r.data.response);
  }

  /**
   * Creates authentication headers.
   */
  private buildHeaders() {
    return {
      "Authorization": `Bearer ${this.token}`,
      "User-Agent"   : ANDROID_USER_AGENT,
    };
  }

  /**
   * Performs the initial authentication request. when using "username" and "password"
   */
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

  /**
   * Ensures that the token has been set.
   */
  private async ensureAuth() {
    if (!this.token) {
      await this.auth();
    }
  }

}
