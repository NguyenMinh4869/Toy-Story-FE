/**
 * Staff Promotion Management Page - READ ONLY (FR-1)
 * Staff can only view promotions, no create/update/delete
 */
import React, { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { adminFilterPromotions } from '../../services/promotionService';
import type { ViewPromotionDto } from '../../types/PromotionDTO';
import Modal from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

// ── Helpers ─────────────────────────────────────────────────────────────────

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

function getDiscountDisplay(p: ViewPromotionDto): string {
  const value = p.discountValue ?? 0;
  if (value <= 0) return '—';
  switch (p.discountType) {
    case 0: return `${value}%`;
    case 1: return `${value.toLocaleString('vi-VN')}đ`;
    case 2: return `Giảm ${value.toLocaleString('vi-VN')}đ ship`;
    case 3: return `Tặng ${value} sản phẩm`;
    default: return String(value);
  }
}

function getDiscountTypeLabel(type?: number): string {
  switch (type) {
    case 0: return 'Phần trăm';
    case 1: return 'Số tiền cố định';
    case 2: return 'Miễn phí vận chuyển';
    case 3: return 'Mua X tặng Y';
    default: return 'Không xác định';
  }
}

const StaffPromotionManagementPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<ViewPromotionDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await adminFilterPromotions({
        ...(debouncedSearch.trim() ? { name: debouncedSearch.trim() } : {}),
        ...(statusFilter !== null ? { isActive: statusFilter } : {})
      });
      setPromotions(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (promotion: ViewPromotionDto) => {
    setSelectedPromotion(promotion);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedPromotion(null);
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Đang tải khuyến mãi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý khuyến mãi</h2>
          <p className="text-sm text-gray-600 mt-1">Chế độ quan sát - Không thể chỉnh sửa</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm khuyến mãi..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {([
            { label: 'Tất cả', value: null },
            { label: 'Đang hoạt động', value: true },
            { label: 'Ngừng hoạt động', value: false },
          ] as { label: string; value: boolean | null }[]).map((tab) => (
            <button
              key={String(tab.value)}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                statusFilter === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Thông tin</th>
                <th scope="col" className="px-6 py-3">Loại ưu đãi</th>
                <th scope="col" className="px-6 py-3">Giá trị</th>
                <th scope="col" className="px-6 py-3">Thời hạn</th>
                <th scope="col" className="px-6 py-3">Trạng thái</th>
                <th scope="col" className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy khuyến mãi
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => {
                  const scope = getScope(promotion);
                  return (
                    <tr key={promotion.promotionId} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="w-10 h-10 rounded-md object-cover mr-4"
                            src={promotion.imageUrl || 'https://via.placeholder.com/40'}
                            alt={promotion.name || 'Promotion'}
                          />
                          <div>
                            <div className="font-semibold">{promotion.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {promotion.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${scope.className}`}>
                          {scope.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-red-600">
                        {getDiscountDisplay(promotion)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <div>Từ: {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString('vi-VN') : 'N/A'}</div>
                          <div>Đến: {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString('vi-VN') : 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {promotion.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleView(promotion)}
                          className="text-emerald-600 hover:text-emerald-800"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Chi tiết khuyến mãi"
      >
        {selectedPromotion && (() => {
          const scope = getScope(selectedPromotion);
          return (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedPromotion.imageUrl ?? 'https://via.placeholder.com/200'}
                  alt={selectedPromotion.name ?? 'Promotion'}
                  className="w-48 h-48 rounded-lg object-cover"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <p className="mt-1 text-gray-900">{selectedPromotion.promotionId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên khuyến mãi</label>
                  <p className="mt-1 text-gray-900 text-lg font-semibold">{selectedPromotion.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <p className="mt-1 text-gray-900">{selectedPromotion.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phạm vi áp dụng</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${scope.className}`}>
                      {scope.label}
                    </span>
                    {selectedPromotion.brandId != null && (
                      <span className="text-sm text-gray-600">— Thương hiệu #{selectedPromotion.brandId}</span>
                    )}
                    {selectedPromotion.productId != null && (
                      <span className="text-sm text-gray-600">— Sản phẩm #{selectedPromotion.productId}</span>
                    )}
                    {selectedPromotion.categoryId != null && (
                      <span className="text-sm text-gray-600">— Phân loại #{selectedPromotion.categoryId}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại giảm giá</label>
                    <p className="mt-1 text-gray-900">{getDiscountTypeLabel(selectedPromotion.discountType)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giá trị</label>
                    <p className="mt-1 text-red-600 font-semibold">{getDiscountDisplay(selectedPromotion)}</p>
                  </div>
                  {(selectedPromotion.minimumQuantity ?? 0) > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số lượng tối thiểu</label>
                      <p className="mt-1 text-gray-900">{selectedPromotion.minimumQuantity}</p>
                    </div>
                  )}
                  {(selectedPromotion.minimumAmount ?? 0) > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá trị đơn tối thiểu</label>
                      <p className="mt-1 text-gray-900">{selectedPromotion.minimumAmount?.toLocaleString('vi-VN')}đ</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <p className="mt-1 text-gray-900">
                      {selectedPromotion.startDate ? new Date(selectedPromotion.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <p className="mt-1 text-gray-900">
                      {selectedPromotion.endDate ? new Date(selectedPromotion.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedPromotion.isActive ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedPromotion.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default StaffPromotionManagementPage;
