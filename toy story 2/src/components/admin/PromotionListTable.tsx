import React from 'react';
import type { ViewPromotionDto } from '../../types/PromotionDTO';
import { Edit, Power, PowerOff } from 'lucide-react';

interface PromotionListTableProps {
  promotions: ViewPromotionDto[];
  onEdit: (promotion: ViewPromotionDto) => void;
  onStatusChange: (id: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

type ScopeMeta = { label: string; className: string };

function getScope(p: ViewPromotionDto): ScopeMeta {
  if (p.productId != null)
    return { label: 'Sản phẩm cụ thể', className: 'bg-blue-100 text-blue-800' };
  if (p.brandId != null)
    return { label: 'Thương hiệu', className: 'bg-purple-100 text-purple-800' };
  if (p.categoryId != null)
    return { label: 'Phân loại', className: 'bg-orange-100 text-orange-800' };
  return { label: 'Tất cả sản phẩm', className: 'bg-green-100 text-green-800' };
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

function getDiscountDisplay(p: ViewPromotionDto): string {
  const value = p.discountValue ?? 0;
  if (value <= 0) return '—';
  switch (p.discountType) {
    case 0: return `${value}%`;                        // Percentage
    case 1: return formatVND(value);                   // Fixed amount
    case 2: return `Giảm ${formatVND(value)} ship`;    // Shipping discount
    case 3: return `Tặng ${value} sản phẩm`;           // Buy X Get Y
    default: return String(value);
  }
}

// ── Component ──────────────────────────────────────────────────────────────

const PromotionListTable: React.FC<PromotionListTableProps> = ({
  promotions,
  onEdit,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại ưu đãi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá trị
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {promotions.map((promotion) => {
            const scope = getScope(promotion);
            const discountDisplay = getDiscountDisplay(promotion);
            return (
              <tr key={promotion.promotionId} className="hover:bg-gray-50">
                {/* Tên */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {promotion.imageUrl && (
                      <img
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        src={promotion.imageUrl}
                        alt=""
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900">{promotion.name}</span>
                  </div>
                </td>

                {/* Loại ưu đãi */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${scope.className}`}>
                    {scope.label}
                  </span>
                </td>

                {/* Giá trị */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-800">{discountDisplay}</span>
                </td>

                {/* Thời gian */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col gap-0.5">
                    <span>
                      Từ:{' '}
                      {promotion.startDate
                        ? new Date(promotion.startDate).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </span>
                    <span>
                      Đến:{' '}
                      {promotion.endDate
                        ? new Date(promotion.endDate).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      promotion.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {promotion.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>

                {/* Hành động */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(promotion)}
                      className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                    >
                      <Edit size={14} /> Chỉnh sửa
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
                        <><PowerOff size={14} /> Ngừng hoạt động</>
                      ) : (
                        <><Power size={14} /> Kích hoạt</>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionListTable;
