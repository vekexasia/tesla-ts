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
export type PowerwallStatus = {
  site_name: string;
  id: string;
  energy_left: number; // Wh
  total_pack_energy: number; // Wh
  percentage_charged: number;
  battery_power: number; // W (- charging, + discharging)
};
