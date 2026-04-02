import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
// import { toast } from 'react-toastify';
import BrandListTable from '../../components/admin/BrandListTable';
import Modal from '../../components/ui/Modal';
import {
  createBrand,
  updateBrand,
  changeBrandStatus,
  filterBrands,
  getDeactivatePreview,
  getReactivatePreview,
  reactivateBulk,
} from '../../services/brandService';
import type {
  BrandActionPreviewDto,
  AffectedProductDto,
  AffectedPromotionDto,
  AffectedSetDto,
} from '../../services/brandService';
import Pagination from '../../components/ui/Pagination';
import type { ViewBrandDto, CreateBrandDto, UpdateBrandDto } from '../../types/BrandDTO';

const PAGE_SIZE = 5;

const BrandManagementPage: React.FC = () => {
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<0 | 1 | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = params.get('q') || '';
    if (debouncedSearch === current) return;
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    params.delete('page');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [debouncedSearch]);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') || String(PAGE_SIZE)));

  const paginatedBrands = useMemo(() => {
    const start = (page - 1) * pageSize;
    return brands.slice(start, start + pageSize);
  }, [brands, page, pageSize]);

  const totalPages = Math.ceil(brands.length / pageSize);

  // ── Create / Edit modal ────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<ViewBrandDto | null>(null);
  const [formData, setFormData] = useState<Partial<CreateBrandDto>>({ name: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ── Deactivate preview modal ───────────────────────────────────────────────
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivatePreview, setDeactivatePreview] = useState<BrandActionPreviewDto | null>(null);
  const [deactivateTargetId, setDeactivateTargetId] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // ── Reactivate preview modal ───────────────────────────────────────────────
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [reactivatePreview, setReactivatePreview] = useState<BrandActionPreviewDto | null>(null);
  const [reactivateTargetId, setReactivateTargetId] = useState<number | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [selectedPromotionIds, setSelectedPromotionIds] = useState<Set<number>>(new Set());
  const [selectedSetIds, setSelectedSetIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [location.search, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams(location.search).get('q') || '';
      const allBrands = await filterBrands({
        ...(q.trim() ? { name: q.trim() } : {}),
        ...(statusFilter !== undefined ? { status: statusFilter } : {}),
      });
      setBrands(allBrands);
    } catch (err) {
      console.error(err);
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Vui lòng nhập tên thương hiệu.');
      return;
    }
    try {
      setLoading(true);
      if (currentBrand && currentBrand.brandId) {
        await updateBrand(currentBrand.brandId, formData as UpdateBrandDto, imageFile || undefined);
      } else {
        await createBrand(formData as CreateBrandDto, imageFile || undefined);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number) => {
    const brand = brands.find(b => b.brandId === id);
    if (!brand) return;

    const isActive =
      brand.status?.toLowerCase() === 'active' ||
      brand.status?.toLowerCase() === 'đang hoạt động';

    if (isActive) {
      // Open deactivate preview modal
      setDeactivateTargetId(id);
      setDeactivatePreview(null);
      setPreviewError(null);
      setDeactivateModalOpen(true);
      setPreviewLoading(true);
      try {
        const preview = await getDeactivatePreview(id);
        setDeactivatePreview(preview);
      } catch {
        setPreviewError('Không thể tải dữ liệu xem trước. Vui lòng thử lại.');
      } finally {
        setPreviewLoading(false);
      }
    } else {
      // Open reactivate preview modal
      setReactivateTargetId(id);
      setReactivatePreview(null);
      setPreviewError(null);
      setSelectedProductIds(new Set());
      setSelectedPromotionIds(new Set());
      setSelectedSetIds(new Set());
      setReactivateModalOpen(true);
      setPreviewLoading(true);
      try {
        const preview = await getReactivatePreview(id);
        setReactivatePreview(preview);
      } catch {
        setPreviewError('Không thể tải dữ liệu xem trước. Vui lòng thử lại.');
      } finally {
        setPreviewLoading(false);
      }
    }
  };

  // ── Confirm deactivate (uses existing toggle) ──────────────────────────────
  const handleConfirmDeactivate = async () => {
    if (!deactivateTargetId) return;
    try {
      setLoading(true);
      await changeBrandStatus(deactivateTargetId);
      setDeactivateModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Vô hiệu hóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  // ── Confirm reactivate (selective bulk) ───────────────────────────────────
  const handleConfirmReactivate = async () => {
    if (!reactivateTargetId) return;
    setBulkLoading(true);
    try {
      await reactivateBulk({
        brandId: reactivateTargetId,
        productIds: Array.from(selectedProductIds),
        promotionIds: Array.from(selectedPromotionIds),
        setIds: Array.from(selectedSetIds),
      });
      setReactivateModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Kích hoạt lại thất bại');
    } finally {
      setBulkLoading(false);
    }
  };

  // ── Checkbox helpers ───────────────────────────────────────────────────────
  const toggleProduct = (id: number) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePromotion = (id: number) => {
    setSelectedPromotionIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllProducts = () => {
    if (!reactivatePreview) return;
    const all = reactivatePreview.affectedProducts.map((p: AffectedProductDto) => p.productId);
    setSelectedProductIds(prev => prev.size === all.length ? new Set() : new Set(all));
  };

  const toggleAllPromotions = () => {
    if (!reactivatePreview) return;
    const all = reactivatePreview.affectedPromotions.map((p: AffectedPromotionDto) => p.promotionId);
    setSelectedPromotionIds(prev => prev.size === all.length ? new Set() : new Set(all));
  };

  const toggleSet = (id: number) => {
    setSelectedSetIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllSets = () => {
    if (!reactivatePreview) return;
    const all = reactivatePreview.affectedSets.map((s: AffectedSetDto) => s.setId);
    setSelectedSetIds(prev => prev.size === all.length ? new Set() : new Set(all));
  };

  const openCreateModal = () => {
    setCurrentBrand(null);
    setFormData({ name: '' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (brand: ViewBrandDto) => {
    setCurrentBrand(brand);
    setFormData({
      name: brand.name || ''
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thương hiệu</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <Plus size={20} />
          Thêm thương hiệu
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {([
          { label: 'Tất cả', value: undefined },
          { label: 'Đang hoạt động', value: 0 },
          { label: 'Ngừng hoạt động', value: 1 },
        ] as { label: string; value: typeof statusFilter }[]).map(tab => (
          <button
            key={tab.label}
            onClick={() => { setStatusFilter(tab.value); navigate(location.pathname); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              statusFilter === tab.value
                ? 'bg-red-400 text-white border-red-400'
                : 'bg-white text-gray-600 border-gray-300 hover:border-red-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-red-400 w-56"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && !isModalOpen && !deactivateModalOpen && !reactivateModalOpen ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <>
            <BrandListTable
              brands={paginatedBrands}
              onEdit={openEditModal}
              onChangeStatus={handleStatusChange}
            />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => {
                const next = new URLSearchParams(location.search)
                next.set('page', String(nextPage))
                navigate(`${location.pathname}?${next.toString()}`)
              }}
            />
          </>
        </div>
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBrand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {currentBrand?.imageUrl && !imageFile && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                <img src={currentBrand.imageUrl} alt="Current" className="h-20 rounded" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black disabled:opacity-50"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Deactivate Preview Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title="Xác nhận vô hiệu hóa thương hiệu"
        size="xl"
      >
        {previewLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : previewError ? (
          <div className="text-red-600 py-4">{previewError}</div>
        ) : deactivatePreview && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Vô hiệu hóa thương hiệu <span className="font-semibold text-gray-900">"{deactivatePreview.brandName}"</span> sẽ
              đồng thời vô hiệu hóa các sản phẩm và chương trình khuyến mãi sau:
            </p>

            {/* Affected Products */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {deactivatePreview.affectedProducts.length} Sản phẩm
              </p>
              {deactivatePreview.affectedProducts.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có sản phẩm nào bị ảnh hưởng.</p>
              ) : (
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-y-auto max-h-48">
                  {deactivatePreview.affectedProducts.map((p: AffectedProductDto) => (
                    <li key={p.productId} className="px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                      {p.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Affected Promotions */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {deactivatePreview.affectedPromotions.length} Khuyến mãi
              </p>
              {deactivatePreview.affectedPromotions.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có khuyến mãi nào bị ảnh hưởng.</p>
              ) : (
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-y-auto max-h-48">
                  {deactivatePreview.affectedPromotions.map((pr: AffectedPromotionDto) => (
                    <li key={pr.promotionId} className="px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                      {pr.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Affected Sets */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {deactivatePreview.affectedSets.length} Bộ sản phẩm
              </p>
              {deactivatePreview.affectedSets.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có bộ sản phẩm nào bị ảnh hưởng.</p>
              ) : (
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-y-auto max-h-48">
                  {deactivatePreview.affectedSets.map((s: AffectedSetDto) => (
                    <li key={s.setId} className="px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeactivateModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeactivate}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-3xl font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận vô hiệu hóa'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Reactivate Modal (with checkboxes) ─────────────────────────────── */}
      <Modal
        isOpen={reactivateModalOpen}
        onClose={() => setReactivateModalOpen(false)}
        title="Kích hoạt lại thương hiệu"
        size="xl"
      >
        {previewLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : previewError ? (
          <div className="text-red-600 py-4">{previewError}</div>
        ) : reactivatePreview && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Thương hiệu <span className="font-semibold text-gray-900">"{reactivatePreview.brandName}"</span> có các sản phẩm
              và khuyến mãi đang bị vô hiệu hóa. Vui lòng chọn những mục bạn muốn kích hoạt lại cùng thương hiệu:
            </p>

            {/* Product checklist */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">
                  Sản phẩm ({reactivatePreview.affectedProducts.length})
                </p>
                {reactivatePreview.affectedProducts.length > 0 && (
                  <button
                    onClick={toggleAllProducts}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    {selectedProductIds.size === reactivatePreview.affectedProducts.length
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                )}
              </div>
              {reactivatePreview.affectedProducts.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có sản phẩm nào cần kích hoạt lại.</p>
              ) : (
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-y-auto max-h-48">
                  {reactivatePreview.affectedProducts.map((p: AffectedProductDto) => {
                    const isSelected = selectedProductIds.has(p.productId);
                    return (
                      <li
                        key={p.productId}
                        onClick={() => toggleProduct(p.productId)}
                        className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`prod-${p.productId}`}
                          checked={isSelected}
                          onChange={() => toggleProduct(p.productId)}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-400 cursor-pointer accent-green-500 flex-shrink-0"
                        />
                        <label htmlFor={`prod-${p.productId}`} className={`text-sm cursor-pointer select-none ${isSelected ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                          {p.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Promotion checklist */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">
                  Khuyến mãi ({reactivatePreview.affectedPromotions.length})
                </p>
                {reactivatePreview.affectedPromotions.length > 0 && (
                  <button
                    onClick={toggleAllPromotions}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    {selectedPromotionIds.size === reactivatePreview.affectedPromotions.length
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                )}
              </div>
              {reactivatePreview.affectedPromotions.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có khuyến mãi nào cần kích hoạt lại.</p>
              ) : (
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-y-auto max-h-48">
                  {reactivatePreview.affectedPromotions.map((pr: AffectedPromotionDto) => {
                    const isSelected = selectedPromotionIds.has(pr.promotionId);
                    return (
                      <li
                        key={pr.promotionId}
                        onClick={() => togglePromotion(pr.promotionId)}
                        className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`promo-${pr.promotionId}`}
                          checked={isSelected}
                          onChange={() => togglePromotion(pr.promotionId)}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-400 cursor-pointer accent-green-500 flex-shrink-0"
                        />
                        <label htmlFor={`promo-${pr.promotionId}`} className={`text-sm cursor-pointer select-none ${isSelected ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                          {pr.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Set checklist */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-800">
                  Bộ sản phẩm ({reactivatePreview.affectedSets.length})
                </p>
                {reactivatePreview.affectedSets.length > 0 && (
                  <button
                    onClick={toggleAllSets}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    {selectedSetIds.size === reactivatePreview.affectedSets.length
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                )}
              </div>
              {reactivatePreview.affectedSets.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Không có bộ sản phẩm nào cần kích hoạt lại.</p>
              ) : (
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-y-auto max-h-48">
                  {reactivatePreview.affectedSets.map((s: AffectedSetDto) => {
                    const isSelected = selectedSetIds.has(s.setId);
                    return (
                      <li
                        key={s.setId}
                        onClick={() => toggleSet(s.setId)}
                        className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-l-4 border-green-500'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`set-${s.setId}`}
                          checked={isSelected}
                          onChange={() => toggleSet(s.setId)}
                          onClick={e => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-400 cursor-pointer accent-green-500 flex-shrink-0"
                        />
                        <label htmlFor={`set-${s.setId}`} className={`text-sm cursor-pointer select-none ${isSelected ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                          {s.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReactivateModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReactivate}
                disabled={bulkLoading}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-3xl font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {bulkLoading ? 'Đang xử lý...' : 'Xác nhận kích hoạt lại'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BrandManagementPage;
