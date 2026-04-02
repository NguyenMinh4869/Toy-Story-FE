/**
 * Staff Set Management Page - READ ONLY (FR-1)
 * Staff can only view sets (active + inactive), no create/update/delete
 */
import React, { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { adminFilterSets } from '../../services/setService';
import type { ViewSetDetailDto as ViewSetDto } from '../../types/SetDTO';
import Modal from '../../components/ui/Modal';
import { useDebounce } from '../../hooks/useDebounce';

// ── Status helpers ──────────────────────────────────────────────────────────
// Backend serializes ProductStatus via EnumHelper.GetDisplayName() → Vietnamese string.
// generated.ts types this as 0|1|2 (stale), so we accept `unknown` and cast.
function getSetStatusBadge(status?: unknown) {
  const s = status as string | null | undefined;
  let className = 'bg-orange-100 text-orange-800';
  if (s === 'Đang bán') className = 'bg-green-100 text-green-800';
  else if (s === 'Hết hàng') className = 'bg-red-100 text-red-800';
  return { label: s ?? '—', className };
}

const StaffSetManagementPage: React.FC = () => {
  const [sets, setSets] = useState<ViewSetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<ViewSetDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [statusFilter, setStatusFilter] = useState<0 | 1 | 2 | null>(null);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await adminFilterSets({
        ...(debouncedSearch.trim() ? { name: debouncedSearch.trim() } : {}),
        ...(statusFilter !== null ? { status: statusFilter } : {})
      });
      setSets(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách bộ sưu tập');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (set: ViewSetDto) => {
    setSelectedSet(set);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedSet(null);
  };

  if (loading && sets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Đang tải bộ sưu tập...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý bộ sưu tập</h2>
          <p className="text-sm text-gray-600 mt-1">Chế độ quan sát - Không thể chỉnh sửa</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bộ sưu tập..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {([
            { label: 'Tất cả', value: null },
            { label: 'Đang bán', value: 0 },
            { label: 'Ngừng bán', value: 1 },
            { label: 'Hết hàng', value: 2 },
          ] as { label: string; value: 0 | 1 | 2 | null }[]).map((tab) => (
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
                <th scope="col" className="px-6 py-3">Thông tin bộ sưu tập</th>
                <th scope="col" className="px-6 py-3">Giảm giá</th>
                <th scope="col" className="px-6 py-3">Giá</th>
                <th scope="col" className="px-6 py-3">Số sản phẩm</th>
                <th scope="col" className="px-6 py-3">Trạng thái</th>
                <th scope="col" className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy bộ sưu tập
                  </td>
                </tr>
              ) : (
                sets.map((set) => {
                  const badge = getSetStatusBadge(set.status);
                  return (
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
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {set.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-red-600 font-semibold">
                      {set.discountPercent || 0}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">
                        {set.price?.toLocaleString('vi-VN')} VND
                      </div>
                      {set.savings && (
                        <div className="text-xs text-green-600">
                          Tiết kiệm {set.savings.toLocaleString('vi-VN')} VND
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{set.totalItems || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(set)}
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

      {/* View Set Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Chi tiết bộ sưu tập"
      >
        {selectedSet && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedSet.imageUrl || 'https://via.placeholder.com/200'}
                alt={selectedSet.name || 'Set'}
                className="w-48 h-48 rounded-lg object-cover"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-gray-900">{selectedSet.setId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên bộ sưu tập</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">{selectedSet.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <p className="mt-1 text-gray-900">{selectedSet.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giảm giá</label>
                  <p className="mt-1 text-red-600 font-semibold">{selectedSet.discountPercent || 0}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số sản phẩm</label>
                  <p className="mt-1 text-gray-900 font-semibold">{selectedSet.totalItems || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá</label>
                  <p className="mt-1 text-emerald-600 font-semibold">{selectedSet.price?.toLocaleString('vi-VN')} VND</p>
                </div>
                {selectedSet.savings && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tiết kiệm</label>
                    <p className="mt-1 text-green-600 font-semibold">{selectedSet.savings.toLocaleString('vi-VN')} VND</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                {(() => {
                  const badge = getSetStatusBadge(selectedSet.status);
                  return (
                    <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                  );
                })()}
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
        )}
      </Modal>
    </div>
  );
};

export default StaffSetManagementPage;