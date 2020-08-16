import { ITeslaApiRequestor } from "../ITeslaApiRequestor";
import { PowerwallCommands } from "./commands";
import { PowerwallLiveStatus, PowerwallProduct, PowerwallStatusInfo } from "./types";

export class PowerwallAPI {

  /**
   * Access the commands (write-requests) for this behicle.
   */
  public readonly commands: PowerwallCommands;

  constructor(private apiRequestor: ITeslaApiRequestor, public data: PowerwallProduct) {
    this.commands = new PowerwallCommands(apiRequestor, data);
  }

  /**
   * Current site information status & configuration
   */
  public async statusInfo(): Promise<PowerwallStatusInfo> {
    return this.apiRequestor.getRequest(`/energy_sites/${this.data.energy_site_id}/site_info`);
  }

  /**
   * Gets the current live status (power, grid, solar, load)
   */
  public async liveStatus(): Promise<PowerwallLiveStatus> {
    return this.apiRequestor.getRequest(`/energy_sites/${this.data.energy_site_id}/live_status`);
  }

  public async history(): Promise<any> {
    return this.apiRequestor.getRequest(`/energy_sites/${this.data.energy_site_id}/history`);
  }
}
