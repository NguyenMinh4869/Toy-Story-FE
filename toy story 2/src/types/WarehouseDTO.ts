import type { components } from "./generated";

export type WarehouseSummaryDto = components["schemas"]["WarehouseSummaryDto"];
export type WarehouseDetailDto = components["schemas"]["WarehouseDetailDto"];
export type CreateWarehouseResponseDto =
  components["schemas"]["CreateWarehouseResponseDto"];

export interface CreateWarehouseDto {
  Name: string;
  Location: string;
  DistrictCode?: number;
  ProvinceCode?: number;
  WardCode?: number;
  LowStockThreshold?: number;
}

export interface UpdateWarehouseDto {
  Name?: string;
  Location?: string;
  DistrictCode?: number;
  ProvinceCode?: number;
  WardCode?: number;
  LowStockThreshold?: number;
}

export interface WarehouseWithNames extends WarehouseSummaryDto {
  wardName?: string;
  districtName?: string;
  provinceName?: string;
  fullAddress?: string;
}
