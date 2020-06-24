import assert from "assert";
import { ITeslaApiRequestor } from "./ITeslaApiRequestor";
import { PowerwallProduct } from "./types";

// tslint:disable-next-line:interface-name
interface DefaultCommandResult {
  result: boolean;
  reason: string;
}

export class PowerwallCommands {

  constructor(private apiRequestor: ITeslaApiRequestor, private powerwall: PowerwallProduct) {
  }

  public setBackupReservePercent(percent: number) {
    assert(percent >= 0);
    assert(percent <= 100);
    assert(this.powerwall.backup_capable);
    return this.apiRequestor.postRequest(`/energy_sites/${this.powerwall.energy_site_id}/backup`, {
      battery_reserve_percent: percent,
    });
  }

  /**
   * Sets the Powerwall operating mode.
   * @param mode
   *  - self_consumption: Maximize self consumption
   *  - backup: only power outages will drain power from battery
   *  - autonomous: what is marked as Advanced in the Tesla App (with time based control)
   */
  public setOperatingMode(mode: "self_consumption"|"backup"|"autonomous") {
    return this.apiRequestor.postRequest(`/energy_sites/${this.powerwall.energy_site_id}/operation`, {
      default_real_mode: mode,
    });
  }

}
