import React from 'react';
import type { ViewPromotionSummaryDto } from '../../types/PromotionDTO';
import { Edit, Power, PowerOff } from 'lucide-react';

interface PromotionListTableProps {
  promotions: ViewPromotionSummaryDto[];
  onEdit: (promotion: ViewPromotionSummaryDto) => void;
  onStatusChange: (id: number) => void;
}

const PromotionListTable: React.FC<PromotionListTableProps> = ({
  promotions,
  onEdit,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Range
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {promotions.map((promotion) => (
            <tr key={promotion.promotionId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {promotion.imageUrl && (
                    <img
                      className="h-8 w-8 rounded-full object-cover mr-3"
                      src={promotion.imageUrl}
                      alt=""
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900">{promotion.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {promotion.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span>Start: {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : 'N/A'}</span>
                  <span>End: {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => promotion.promotionId && onStatusChange(promotion.promotionId)}
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    promotion.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {promotion.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEdit(promotion)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button
                    onClick={() => promotion.promotionId && onStatusChange(promotion.promotionId)}
                    className={`text-xs font-medium flex items-center gap-1 ${
                      promotion.isActive
                        ? 'text-yellow-600 hover:text-yellow-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {promotion.isActive ? (
                      <><PowerOff size={14} /> DISABLE</>
                    ) : (
                      <><Power size={14} /> ENABLE</>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionListTable;
