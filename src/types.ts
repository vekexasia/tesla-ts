// tslint:disable-next-line:interface-name
export interface ChargeState {
  battery_heater_on: boolean;
  battery_level: number;
  battery_range: number;
  charge_current_request: number;
  charge_current_request_max: number;
  charge_enable_request: true;
  charge_energy_added: number;
  charge_limit_soc: number;
  charge_limit_soc_max: number;
  charge_limit_soc_min: number;
  charge_limit_soc_std: number;
  charge_miles_added_ideal: number;
  charge_miles_added_rated: number;
  charge_port_cold_weather_mode: null;
  charge_port_door_open: boolean;
  charge_port_latch: string; // Engaged?
  charge_rate: number;
  charge_to_max_range: boolean;
  charger_actual_current: number;
  charger_phases: number;
  charger_pilot_current: number;
  charger_power: number;
  charger_voltage: number;
  charging_state: string; // Disconnected
  conn_charge_cable: null;
  est_battery_range: number;
  // fast_charger_brand: <invalid>,
  // fast_charger_present: boolean,
  // fast_charger_type: <invalid>,
  ideal_battery_range: number;
  managed_charging_active: boolean;
  managed_charging_start_time: null;
  managed_charging_user_canceled: boolean;
  max_range_charge_counter: number;
  not_enough_power_to_heat: boolean;
  scheduled_charging_pending: boolean;
  scheduled_charging_start_time: null;
  time_to_full_charge: number;
  timestamp: number;
  trip_charging: boolean;
  usable_battery_level: number;
  user_charge_enable_request: null;
}
// tslint:disable-next-line:interface-name
export interface ClimateState {
  battery_heater: boolean;
  battery_heater_no_power: boolean;
  climate_keeper_mode: "on"|"off";
  driver_temp_setting: number;
  fan_status: number;
  inside_temp: number;
  is_auto_conditioning_on: boolean;
  is_climate_on: boolean;
  is_front_defroster_on: boolean;
  is_preconditioning: boolean;
  is_rear_defroster_on: boolean;
  left_temp_direction: number;
  max_avail_temp: 28.0;
  min_avail_temp: 15.0;
  outside_temp: number;
  passenger_temp_setting: number;
  remote_heater_control_enabled: boolean;
  right_temp_direction: number;
  seat_heater_left: 0|1|2|3;
  seat_heater_rear_left: 0|1|2|3;
  seat_heater_rear_right: 0|1|2|3;
  seat_heater_right: 0|1|2|3;
  seat_heater_third_row_left: 0|1|2|3;
  seat_heater_third_row_right: 0|1|2|3;
  side_mirror_heaters: boolean;
  smart_preconditioning: boolean;
  steering_wheel_heater: boolean;
  timestamp: number;
  wiper_blade_heater: boolean;
}

// tslint:disable-next-line:interface-name
export interface DriveState {
  gps_as_of: number;
  heading: number;
  latitude: number;
  longitude: number;
  native_latitude: number;
  native_location_supported: 1|0;
  native_longitude: number;
  native_type: "wgs";
  power: null;
  shift_state: null|"D"|"P"|"R";
  speed: null;
  timestamp: number;
}

// tslint:disable-next-line:interface-name
export interface GUISettings {
  gui_24_hour_time: boolean;
  gui_charge_rate_units: "mi/hr"|"km/hr";
  gui_distance_units: "mi/hr"|"km/hr";
  gui_range_display: "Rated";
  gui_temperature_units: "F"|"C";
  timestamp: number;
}

// tslint:disable-next-line:interface-name
export interface BaseVehicle {
  id: number;
  vehicle_id: number;
  vin: string;
  display_name: string;
  option_codes: string;
  color: string;
  tokens: string[];
  state: "online"|"offline";
  in_service: boolean;
  id_s: string;
  calendar_enabled: boolean;
  backseat_token: null;
  backseat_token_updated_at: null;

}
export type VehicleData = BaseVehicle & {
  user_id: number;
  api_version: number;
  charge_state: ChargeState,
  climate_state: ClimateState
  drive_state: DriveState
  gui_settings: GUISettings,
  "vehicle_config": {
    "can_accept_navigation_requests": true,
    "can_actuate_trunks": true,
    "car_special_type": "base",
    "car_type": "modelx"|"models"|"model3"|string,
    "charge_port_type": "US",
    "eu_vehicle": boolean,
    "exterior_color": string,
    "has_air_suspension": true,
    "has_ludicrous_mode": boolean,
    "motorized_charge_port": true,
    "perf_config": string,
    "plg": true,
    "rear_seat_heaters": 3,
    "rear_seat_type": 3,
    "rhd": boolean,
    "roof_color": string,
    "seat_type": 0,
    "spoiler_type": string,
    "sun_roof_installed": 0,
    "third_row_seats": string,
    "timestamp": number,
    "trim_badging": string,
    "wheel_type": string,
  },
  "vehicle_state": {
    "api_version": 6,
    "autopark_state_v2": "ready",
    "autopark_style": "dead_man",
    "calendar_supported": true,
    "car_version": string,
    "center_display_state": 0,
    "df": 0,
    "dr": 0,
    "ft": 0,
    "homelink_nearby": boolean,
    "is_user_present": boolean,
    "last_autopark_error": "no_error",
    "locked": true,
    "media_state": {
      "remote_control_enabled": true,
    },
    "notifications_supported": true,
    "odometer": number,
    "parsed_calendar_supported": true,
    "pf": 0,
    "pr": 0,
    "remote_start": boolean,
    "remote_start_enabled": true,
    "remote_start_supported": true,
    "rt": 0,
    "sentry_mode": boolean,
    "software_update": {
      "expected_duration_sec": number,
      "status": string,
    },
    "speed_limit_mode": {
      "active": boolean,
      "current_limit_mph": number,
      "max_limit_mph": number,
      "min_limit_mph": number,
      "pin_code_set": boolean,
    },
    "sun_roof_percent_open": null,
    "sun_roof_state": "unknown",
    "timestamp": number,
    "valet_mode": boolean,
    "vehicle_name": string,
  }

};

// tslint:disable-next-line:interface-name
export interface StreamItem {
  time: Date;
  speed: number;
  odometer: number;
  soc: number;
  elevation: number;
  lat: number;
  lng: number;
  power: number;
  shiftState: "R"|"D"|"N"|"P";
  range: number;
  estRange: number;
  heading: number;
  estHeading: number;
}

export type VehicleProduct  = BaseVehicle & {
  user_id: string;
  api_version: number;
};

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

export type Product = VehicleProduct | PowerwallProduct;

// tslint:disable-next-line:interface-over-type-literal
export type PowerwallStatus = {
  site_name: string;
  id: string;
  energy_left: number; // Wh
  total_pack_energy: number; // Wh
  percentage_charged: number;
  battery_power: number; // W (- charging, + discharging)
};
