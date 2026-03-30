import {
  apiGet,
  apiPostForm,
  apiPutForm,
  apiDelete,
  apiPut,
  apiPost,
} from "./apiClient";
import type {
  WarehouseSummaryDto,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseDetailDto,
  CreateWarehouseResponseDto,
} from "../types/WarehouseDTO";
import type { components } from "../types/generated";

type UpdateLowStockThresholdDto =
  components["schemas"]["UpdateLowStockThresholdDto"];

export type WarehouseProductDto = components["schemas"]["ProductStockDto"];
export type ProductStockDto = components["schemas"]["ProductStockDto"];
export type CreateWarehouseProductDto =
  components["schemas"]["CreateWarehouseProductDto"];

export const getWarehouses = async (): Promise<WarehouseSummaryDto[]> => {
  const response = await apiGet<WarehouseSummaryDto[]>("/warehouses");
  return response.data;
};

export const getLowStockWarehouses = async (): Promise<ProductStockDto[]> => {
  const response = await apiGet<ProductStockDto[]>("/warehouses/low-stock");
  return response.data;
};

export const getWarehouseById = async (
  warehouseId: number,
): Promise<WarehouseDetailDto> => {
  const response = await apiGet<WarehouseDetailDto>(
    `/warehouses/${warehouseId}`,
  );
  return response.data;
};
export const createWarehouse = async (
  data: CreateWarehouseDto,
): Promise<CreateWarehouseResponseDto> => {
  console.log("📦 createWarehouse received:", data);

  const form = new FormData();
  form.append("Name", data.Name);
  form.append("Location", data.Location);

  if (data.ProvinceCode !== undefined && data.ProvinceCode !== null) {
    form.append("ProvinceCode", String(data.ProvinceCode));
  }

  if (data.DistrictCode !== undefined && data.DistrictCode !== null) {
    form.append("DistrictCode", String(data.DistrictCode));
  }

  if (data.WardCode !== undefined && data.WardCode !== null) {
    form.append("WardCode", String(data.WardCode));
  }

  if (typeof data.LowStockThreshold === "number") {
    form.append("LowStockThreshold", String(data.LowStockThreshold));
  }

  const response = await apiPostForm<CreateWarehouseResponseDto>(
    "/warehouses",
    form,
  );
  console.log("📥 Response:", response.data);
  return response.data;
};

export const updateWarehouse = async (
  warehouseId: number,
  data: UpdateWarehouseDto,
): Promise<{ message: string }> => {
  const form = new FormData();

  if (data.Name !== undefined) form.append("Name", String(data.Name));
  if (data.Location !== undefined) form.append("Location", String(data.Location));

  // Only append if value exists (not null, not undefined)
  if (data.ProvinceCode != null) {
    form.append("ProvinceCode", String(data.ProvinceCode));
  }

  if (data.DistrictCode != null) {
    form.append("DistrictCode", String(data.DistrictCode));
  }

  if (data.WardCode != null) {
    form.append("WardCode", String(data.WardCode));
  }

  if (typeof data.LowStockThreshold === "number") {
    form.append("LowStockThreshold", String(data.LowStockThreshold));
  }

  const response = await apiPutForm<{ message: string }>(
    `/warehouses/${warehouseId}`,
    form,
  );
  return response.data;
};

export const updateWarehouseLowStockThreshold = async (
  warehouseId: number,
  threshold: number,
): Promise<{ message: string }> => {
  const dto: UpdateLowStockThresholdDto = { threshold };
  const response = await apiPut<{ message: string }>(
    `/warehouses/${warehouseId}/low-stock-threshold`,
    dto,
  );
  return response.data;
};

export const deleteWarehouse = async (
  warehouseId: number,
): Promise<{ message: string }> => {
  const response = await apiDelete<{ message: string }>(
    `/warehouses/${warehouseId}`,
  );
  return response.data;
};

export const getWarehouseProducts = async (
  warehouseId: number,
): Promise<WarehouseDetailDto> => {
  const response = await apiGet<WarehouseDetailDto>(
    `/warehouses/${warehouseId}`,
  );
  return response.data;
};

export const getWarehouseProductsWithDetails = async (
  warehouseId: number,
): Promise<ProductStockDto[]> => {
  const warehouseDetail = await getWarehouseProducts(warehouseId);
  return (warehouseDetail.products || []) as ProductStockDto[];
};

/**
 * GET /api/warehouses/staff
 * Returns products in the current staff member's warehouse (requires Staff auth)
 */
export const getWarehouseProductsForStaff = async (): Promise<
  components["schemas"]["ViewWarehouseProductDto"][]
> => {
  const response =
    await apiGet<components["schemas"]["ViewWarehouseProductDto"][]>(
      "/warehouses/staff",
    );
  return response.data;
};

/**
 * PUT /api/warehouses/{productWarehouseId}/product
 * Update quantity of a product in a warehouse
 */
export const updateWarehouseProduct = async (
  productWarehouseId: number,
  quantity: number,
): Promise<{ message: string }> => {
  const response = await apiPut<{ message: string }>(
    `/warehouses/${productWarehouseId}/product`,
    quantity,
  );
  return response.data;
};

/**
 * POST /api/warehouses/product
 * Add a product to a warehouse
 */
export const addWarehouseProduct = async (
  data: CreateWarehouseProductDto,
): Promise<{ message: string }> => {
  const response = await apiPost<{ message: string }>(
    "/warehouses/product",
    data,
  );
  return response.data;
};

/**
 * DELETE /api/warehouses/{productWarehouseId}/product
 * Remove a product from a warehouse
 */
export const removeWarehouseProduct = async (
  productWarehouseId: number,
): Promise<{ message: string }> => {
  const response = await apiDelete<{ message: string }>(
    `/warehouses/${productWarehouseId}/product`,
  );
  return response.data;
};
