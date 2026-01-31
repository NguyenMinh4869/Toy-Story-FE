import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { ViewBrandDto } from '../../types/BrandDTO';

interface BrandListTableProps {
  brands: ViewBrandDto[];
  onEdit: (brand: ViewBrandDto) => void;
  onChangeStatus: (id: number) => void;
}

const BrandListTable: React.FC<BrandListTableProps> = ({ brands, onEdit, onChangeStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Brand Info</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.brandId} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center">
                  <img 
                    className="w-10 h-10 rounded-md object-cover mr-4" 
                    src={brand.imageUrl || '/favicon.ico'} 
                    alt={brand.name || 'Brand'} 
                  />
                  <div>
                    <div className="font-semibold">{brand.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => brand.brandId && onChangeStatus(brand.brandId)}
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                    (brand.status?.toLowerCase() === 'active' || brand.status?.toLowerCase() === 'đang hoạt động')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {brand.status}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(brand)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button 
                    onClick={() => brand.brandId && onChangeStatus(brand.brandId)}
                    className="text-red-600 hover:text-red-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 size={14} /> DELETE
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {brands.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                No brands found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BrandListTable;
