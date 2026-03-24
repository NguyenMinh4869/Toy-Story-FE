import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { ViewSetDetailDto } from '../../types/SetDTO';

interface SetListTableProps {
  sets: ViewSetDetailDto[];
  onEdit: (set: ViewSetDetailDto) => void;
  onDelete: (set: ViewSetDetailDto) => void;
}

const SetListTable: React.FC<SetListTableProps> = ({ sets, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Thông tin</th>
            <th scope="col" className="px-6 py-3">Giảm giá</th>
            <th scope="col" className="px-6 py-3">Giá thành</th>
            <th scope="col" className="px-6 py-3">Sản phẩm</th>
            <th scope="col" className="px-6 py-3">Trạng thái</th>
            <th scope="col" className="px-6 py-3">Hàng động</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set) => (
            <tr key={set.setId} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center">
                  <img 
                    className="w-10 h-10 rounded-md object-cover mr-4" 
                    src={set.imageUrl || 'https://via.placeholder.com/40'} 
                    alt={set.name || 'Set'} 
                  />
                  <div>
                    <div className="font-semibold">{set.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{set.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-green-600 font-semibold">
                {set.discountPercent}%
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-900 font-medium">{set.price?.toLocaleString()} VND</div>
                {set.savings && set.savings > 0 && (
                   <div className="text-xs text-green-600">Tiết kiệm {set.savings.toLocaleString()} VND</div>
                )}
              </td>
              <td className="px-6 py-4">
                {set.totalItems} sản phẩm
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    set.status === 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {set.status === 0 ? 'Đang hoạt động' : set.status === 1 ? 'Hết hàng' : 'Vô hiệu hóa'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(set)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> Chỉnh sửa
                  </button>
                  <button
                    onClick={() => onDelete(set)}
                    className="text-red-600 hover:text-red-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sets.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No sets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SetListTable;
