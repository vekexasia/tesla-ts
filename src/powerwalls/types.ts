// tslint:disable-next-line:interface-over-type-literal
export type PowerwallProduct = {
  energy_site_id: number;
  resource_type: "battery",
  site_name: string,
  id: string,
  gateway_id: string;
  energy_left: number;
  total_pack_energy: number;
  percentage_charged: number;
  battery_type: "ac_powerwall";
  backup_capable: boolean;
  battery_power: number; // watts
  sync_grid_alert_enabled: boolean;
  breaker_alert_enabled: boolean
};

// tslint:disable-next-line:interface-over-type-literal
export type PowerwallStatusInfo = {
  id: string;
  site_name: string;
  backup_reserve_percent: number;
  default_real_mode: "self_consumption" | "backup" | "autonomous";
  installation_date: string;
  user_settings: {
    storm_mode_enabled: boolean;
    sync_grid_alert_enabled: boolean;
    breaker_alert_enabled: boolean;
  },
  components: {
    solar: boolean;
    solar_type: string;
    battery: boolean;
    grid: boolean;
    backup: boolean;
    gateway: "teg" | string;
    load_meter: boolean;
    tou_capable: boolean;
    storm_mode_capable: boolean;
    flex_energy_request_capable: boolean;
    car_charging_data_supported: boolean;
    off_grid_vehicle_charging_reserve_supported: boolean,
    vehicle_charging_performance_view_enabled: boolean,
    vehicle_charging_solar_offset_view_enabled: boolean,
    battery_solar_offset_view_enabled: boolean,
    battery_type: "ac_powerwall",
    configurable: boolean,
    grid_services_enabled: boolean
  }
  version: string;
  battery_count: number;
  tou_settings: {
    optimization_strategy: "economics"|string;
    schedule: {
      target: "off_peak" | "peak";
      week_days: number[],
      start_seconds: number;
      end_seconds: number;
    }[]
  },
  nameplate_power: number;
  nameplate_energy: number;
  installation_time_zone: string;
};

/**
 * All numbers are in Watts or Watt/hour.
 * Positive numbers => discharging/emitting
 * Negative numbers => charging/absorbing
 */
// tslint:disable-next-line:interface-over-type-literal
export type PowerwallLiveStatus = {
  solar_power: number;
  energy_left: number;
  total_pack_energy: number;
  percentage_charged: number,
  backup_capable: boolean,
  battery_power: number,
  load_power: number, // house
  grid_status: "Active" | string,
  grid_services_active: boolean,
  grid_power: number,
  grid_services_power: number,
  generator_power: number,
  storm_mode_active: boolean,
  timestamp: string
};
