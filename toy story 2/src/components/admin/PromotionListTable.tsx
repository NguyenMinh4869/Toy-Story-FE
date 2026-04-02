import React from 'react';
import { ViewPromotionDto } from '../../types/PromotionDTO';
import { formatVND } from '../../utils/formatPrice';

interface PromotionListTableProps {
  promotions: ViewPromotionDto[];
  onEdit: (promotion: ViewPromotionDto) => void;
  onStatusChange: (id: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

interface ScopeMeta {
  label: string;
  className: string;
}

function getScope(p: ViewPromotionDto): ScopeMeta {
  if (p.productId != null && Number(p.productId) > 0)
    return { 
      label: p.productName ? `Sản phẩm: ${p.productName}` : `Sản phẩm (ID: ${p.productId})`, 
      className: 'bg-blue-100 text-blue-800' 
    };
  if (p.brandId != null && Number(p.brandId) > 0)
    return { 
      label: p.brandName ? `Thương hiệu: ${p.brandName}` : `Thương hiệu (ID: ${p.brandId})`, 
      className: 'bg-purple-100 text-purple-800' 
    };
  if (p.categoryId != null && Number(p.categoryId) > 0)
    return { 
      label: p.categoryName ? `Phân loại: ${p.categoryName}` : `Phân loại (ID: ${p.categoryId})`, 
      className: 'bg-orange-100 text-orange-800' 
    };
  return { label: 'Tất cả sản phẩm', className: 'bg-green-100 text-green-800' };
}

function formatDiscount(type: number | undefined, value: number | undefined): string {
  if (value === undefined) return '0';
  switch (type) {
    case 0: return `${value}%`;                      // Percentage
    case 1: return formatVND(value);                   // Fixed amount
    case 2: return `Giảm ${formatVND(value)} ship`;    // Shipping discount
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
    <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-500">Tên</th>
            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-500">Loại ưu đãi</th>
            <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-gray-500">Giá trị</th>
            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-gray-500">Thời gian</th>
            <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-wider text-gray-500">Trạng thái</th>
            <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-gray-500">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {promotions.map((p) => {
            const scope = getScope(p);
            return (
              <tr key={p.promotionId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-gray-100" />
                    )}
                    <div>
                      <div className="text-sm font-bold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black ${scope.className}`}>
                    {scope.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-black text-gray-900">
                    {formatDiscount(p.discountType, p.discountValue)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[11px] text-gray-600">
                    <div>Từ: {p.startDate ? new Date(p.startDate).toLocaleDateString('vi-VN') : '-'}</div>
                    <div>Đến: {p.endDate ? new Date(p.endDate).toLocaleDateString('vi-VN') : '-'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                    p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {p.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEdit(p)} className="text-blue-600 hover:text-blue-900 flex items-center gap-1 font-bold">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Chỉnh sửa
                    </button>
                    <button onClick={() => p.promotionId && onStatusChange(p.promotionId)} className="text-orange-600 hover:text-orange-900 flex items-center gap-1 font-bold">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      {p.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
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
