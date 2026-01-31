import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import type { WarehouseSummaryDto } from '../../types/WarehouseDTO';

interface WarehouseListTableProps {
  warehouses: WarehouseSummaryDto[];
  onEdit: (warehouse: WarehouseSummaryDto) => void;
  onDelete: (id: number) => void;
}

const WarehouseListTable: React.FC<WarehouseListTableProps> = ({ warehouses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Warehouse Name</th>
            <th scope="col" className="px-6 py-3">Location</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse) => (
            <tr key={warehouse.warehouseId} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {warehouse.name}
              </td>
              <td className="px-6 py-4">
                {warehouse.location}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(warehouse)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button 
                    onClick={() => warehouse.warehouseId && onDelete(warehouse.warehouseId)}
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
