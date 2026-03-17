import React, { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";
import type { WarehouseSummaryDto } from "../../types/WarehouseDTO";
import { locationService } from "@/hooks/useLocation";

interface WarehouseListTableProps {
  warehouses: WarehouseSummaryDto[];
  onEdit: (warehouse: WarehouseSummaryDto) => void;
  onDelete: (id: number) => void;
}

const WarehouseListTable: React.FC<WarehouseListTableProps> = ({
  warehouses,
  onEdit,
  onDelete,
}) => {
  const [locationNames, setLocationNames] = useState<Map<number, string>>(
    new Map(),
  );
  const [loading, setLoading] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchLocationNames = async () => {
      const toFetch = warehouses.filter(
        (w) => w.wardCode && !locationNames.has(w.warehouseId!),
      );

      if (toFetch.length === 0) return;

      for (const warehouse of toFetch) {
        setLoading((prev) => new Set(prev).add(warehouse.warehouseId!));

        try {
          const fullAddress = await locationService.getFullAddress(
            warehouse.wardCode!,
          );

          setLocationNames((prev) =>
            new Map(prev).set(warehouse.warehouseId!, fullAddress),
          );
        } catch (error) {
          console.error("Failed to fetch location:", error);
        } finally {
          setLoading((prev) => {
            const newSet = new Set(prev);
            newSet.delete(warehouse.warehouseId!);
            return newSet;
          });
        }
      }
    };

    fetchLocationNames();
  }, [warehouses]);

  const getDisplayLocation = (warehouse: WarehouseSummaryDto) => {
    if (warehouse.wardCode) {
      const names = locationNames.get(warehouse.warehouseId!);
      if (loading.has(warehouse.warehouseId!)) {
        return <span className="text-gray-400">Loading...</span>;
      }
      return names || warehouse.location || "Unknown";
    }
    return warehouse.location || "N/A";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Warehouse Name
            </th>
            <th scope="col" className="px-6 py-3">
              Location
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr
              key={warehouse.warehouseId}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {warehouse.name}
              </td>
              <td className="px-6 py-4">{getDisplayLocation(warehouse)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onEdit(warehouse)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button
                    onClick={() =>
                      warehouse.warehouseId && onDelete(warehouse.warehouseId)
                    }
                    className="text-red-600 hover:text-red-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 size={14} /> DELETE
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {warehouses.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No warehouses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseListTable;
