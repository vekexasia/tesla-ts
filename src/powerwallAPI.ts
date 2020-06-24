import { ITeslaApiRequestor } from "./ITeslaApiRequestor";
import { PowerwallCommands } from "./powerwallCommands";
import { ClimateState, DriveState, PowerwallProduct, PowerwallStatus } from "./types";

export class PowerwallAPI {

  /**
   * Access the commands (write-requests) for this behicle.
   */
  public readonly commands: PowerwallCommands;

  constructor(private apiRequestor: ITeslaApiRequestor, public data: PowerwallProduct) {
    this.commands = new PowerwallCommands(apiRequestor, data);
  }

  /**
   * Fetch the Battery information from the API
   */
  public async status(): Promise<PowerwallStatus> {
    return this.apiRequestor.getRequest(`/powerwalls/${this.data.id}/status`);
  }

  public async backupReservePercentSetting(): Promise<any> {
    return this.apiRequestor.getRequest(`/energy_sites/${this.data.energy_site_id}/site_info`);
  }

  /**
   * Climate settings including seats, vents battery, steering wheel, and preconditioning state.
   */
  public async batteryData(): Promise<ClimateState> {
    return this.apiRequestor.getRequest(`/vehicles/${this.data.id}`);
  }

  /**
   * Drive state including latitude, longitude, and heading of the data.
   */
  public async driveState(): Promise<DriveState> {
    return this.apiRequestor.getRequest(`/vehicles/${this.data.id}/drive_state`);
  }

}
