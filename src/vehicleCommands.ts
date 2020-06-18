import { ITeslaApiRequestor } from "./ITeslaApiRequestor";
import { BaseVehicle } from "./types";

// tslint:disable-next-line:interface-name
interface DefaultCommandResult { result: boolean; reason: string; }

export class VehicleCommands {

  constructor(private apiRequestor: ITeslaApiRequestor, private vehicle: BaseVehicle) {
  }

  /**
   * Issues a WakeUp to the vehicle. This is used to initialize communication with the vehicle when the car is
   * in deep-sleep.
   */
  public async wakeUp(): Promise<BaseVehicle> {
    return this.apiRequestor.postRequest<BaseVehicle>(`/vehicles/${this.vehicle.id}/wake_up`);
  }

  public async unlockDoors(): Promise<true> {
    return this.apiRequestor.getRequest<DefaultCommandResult>(this.commandAPIPath(`door_unlock`))
      .then((r) => this.mapResponse(r));
  }

  public async lockDoors(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`door_lock`))
      .then((r) => this.mapResponse(r));
  }

  public async honkHorn(): Promise<true> {
    return this.apiRequestor.getRequest<DefaultCommandResult>(this.commandAPIPath(`honk_horn`))
      .then((r) => this.mapResponse(r));
  }

  public async flashLights(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`flash_lights`))
      .then((r) => this.mapResponse(r));
  }

  /**
   * Starts HVAC in auto mode.
   */
  public async startHVAC(): Promise<true> {
    return this.apiRequestor.getRequest<DefaultCommandResult>(this.commandAPIPath(`auto_conditioning_start`))
      .then((r) => this.mapResponse(r));
  }

  /**
   * Sets HVAC temperatures (in C°) for both driver and passenger.
   * @param driverC
   * @param passengerC
   */
  public async setTemperature(driverC: number, passengerC: number = driverC): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`set_temps`),
      null,
      {
        driver_temp: driverC,
        passenger_temp: passengerC,
      })
      .then((r) => this.mapResponse(r));
  }

  public async setChargeLimit(percent: number): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`set_charge_limit`),
      null,
      { percent })
      .then((r) => this.mapResponse(r));
  }

  public async setChargeLimitMax(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`charge_max_range`))
      .then((r) => this.mapResponse(r));
  }

  public async setChargeLimitStandard(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`charge_standard`))
      .then((r) => this.mapResponse(r));
  }

  public async actuateTrunk(which: "rear"|"front"): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`actuate_trunk`),
      { which_trunk: which },
      )
      .then((r) => this.mapResponse(r));
  }

  public async remoteDrive(password: string): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`remote_start_drive`),
      null,
      { password })
      .then((r) => this.mapResponse(r));
  }

  public async chargePortOpen(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`charge_port_door_open`))
      .then((r) => this.mapResponse(r));
  }
  public async chargePortClose(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`charge_port_door_close`))
      .then((r) => this.mapResponse(r));
  }

  public async chargeStart(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`charge_start`))
      .then((r) => this.mapResponse(r));
  }

  public async chargeStop(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`charge_stop`))
      .then((r) => this.mapResponse(r));
  }

  public setValetMode(on: boolean, pin: string): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath("set_valet_mode"),
      {
        on: `${on}`,
        password: pin,
      })
      .then((r) => this.mapResponse(r));
  }
  // public resetPin(on: boolean, pin?: number): Promise<true> {
  //   return this.apiRequestor.postRequest<DefaultCommandResult>(`vehicles/${this.vehicle.id}/set_valet_modecommand/`,
  //     )
  //     .then((r) => this.mapResponse(r))
  // }

  public speedLimitActivate(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`speed_limit_activate`),
      )
      .then((r) => this.mapResponse(r));
  }
  public speedLimitDeactivate(): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`speed_limit_deactivate`),
      )
      .then((r) => this.mapResponse(r));
  }
  public speedLimitSet(limitMPH: number): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`speed_limit_set_limit`),
      {},
      { limit_mph: limitMPH},
      )
      .then((r) => this.mapResponse(r));
  }
  public speedLimitClearPIN(pin: number): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`speed_limit_clear_pin`),
      {},
      { pin },
      )
      .then((r) => this.mapResponse(r));
  }

  public homeLinkTrigger(lat: number, lon: number): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`trigger_homelink`),
      {},
      { lat, lon },
    )
      .then((r) => this.mapResponse(r));
  }

  public setWindows(cmd: "vent"|"close"): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`window_control`),
      {},
      { lat: 0, lon: 0, command: cmd },
    )
      .then((r) => this.mapResponse(r));
  }

  public sentry(set: boolean): Promise<true> {
    return this.apiRequestor.postRequest<DefaultCommandResult>(this.commandAPIPath(`window_control`),
      {},
      { on: set })
      .then((r) => this.mapResponse(r));
  }

  private commandAPIPath(suffix: string): string {
    return `/vehicles/${this.vehicle.id}/command/${suffix}`;
  }

  private async mapResponse(r: DefaultCommandResult): Promise<true> {
    if (!r.result) {
      throw new Error(`Error response: ${JSON.stringify(r)}`);
    }
    return true;
  }

}
