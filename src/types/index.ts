import { PowerwallProduct } from "./powerwalls";
import { VehicleProduct } from "./vehicles";

export * from "./vehicles";
export * from "./powerwalls";
export type Product = VehicleProduct | PowerwallProduct;
