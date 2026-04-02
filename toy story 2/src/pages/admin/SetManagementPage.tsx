import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import SetListTable from '../../components/admin/SetListTable';
import Modal from '../../components/ui/Modal';
import {
  adminFilterSets,
  getSetById,
  createSet,
  updateSet,
  addProductToSet,
  removeProductFromSet,
  updateSetProductQuantity,
  deleteSet,
  getSetReactivatePreview,
  reactivateSetBulk,
} from '../../services/setService';
import type { SetReactivatePreviewDto, SetAffectedProductDto } from '../../services/setService';
import { filterProducts } from '../../services/productService';
import { getWarehouses, getWarehouseById } from '../../services/warehouseService';
import type { ViewSetDetailDto, CreateSetDto, UpdateSetDto, CreateSetProductDto } from '../../types/SetDTO';
import type { ViewProductDto } from '../../types/ProductDTO';
import type { WarehouseDetailDto } from '../../types/WarehouseDTO';
import Pagination from '../../components/ui/Pagination';

const PAGE_SIZE = 10;

const SetManagementPage: React.FC = () => {
  const [sets, setSets] = useState<ViewSetDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<0 | 1 | undefined>(undefined);

  const [confirmSet, setConfirmSet] = useState<ViewSetDetailDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reactivate modal state
  const [reactivateSet, setReactivateSet] = useState<ViewSetDetailDto | null>(null);
  const [reactivatePreview, setReactivatePreview] = useState<SetReactivatePreviewDto | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [previewLoading, setPreviewLoading] = useState(false);
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [currentSet, setCurrentSet] = useState<ViewSetDetailDto | null>(null);
  const [currentSetDetail, setCurrentSetDetail] = useState<ViewSetDetailDto | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CreateSetDto>>({
    Name: '',
    Description: '',
    DiscountPercent: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [products, setProducts] = useState<ViewProductDto[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

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
  const q = searchParams.get('q') || '';

  const filteredSets = useMemo(() => {
    if (!q) return sets;
    return sets.filter(set =>
      set.name?.toLowerCase().includes(q.toLowerCase())
    );
  }, [sets, q]);

  const paginatedSets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSets.slice(start, start + PAGE_SIZE);
  }, [filteredSets, page]);

  const totalPages = Math.ceil(filteredSets.length / PAGE_SIZE);

  // Because ViewSetDto does not contain set items, we can only manage items added/removed during this modal session.
  // Existing items cannot be listed without a dedicated endpoint.
  const [selectedItems, setSelectedItems] = useState<Array<{ productId: number; quantity: number }>>([]);
  const [isProductTableModalOpen, setIsProductTableModalOpen] = useState(false);
  const [productTableSearch, setProductTableSearch] = useState('');
  const [pendingSelectionQtys, setPendingSelectionQtys] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  useEffect(() => {
    // Fetch all products for the dropdown in the modal
    filterProducts({ status: 0 })
      .then(setProducts)
      .catch(() => setError('Failed to load products for selection'));

    // Build total stock per product across all warehouses
    (async () => {
      try {
        const warehouses = await getWarehouses();
        const details: WarehouseDetailDto[] = await Promise.all(
          (warehouses || [])
            .filter(w => (w.warehouseId || 0) > 0)
            .map(w => getWarehouseById(w.warehouseId as number))
        );

        const totals: Record<number, number> = {};
        for (const d of details) {
          for (const p of d.products || []) {
            const pid = p.productId || 0;
            const qty = p.quantity || 0;
            if (pid <= 0) continue;
            totals[pid] = (totals[pid] || 0) + qty;
          }
        }
      } catch (e) {
        console.error(e);
        // Do not block set creation if stock cannot be loaded.
      }
    })();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await adminFilterSets({ status: statusFilter });
      setSets(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load sets');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'DiscountPercent' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Name?.trim()) {
      setError('Vui lòng nhập tên bộ sưu tập.');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Final validation before submit — stock check intentionally removed.
      // Sets are catalog definitions; stock constraints apply at purchase time, not set creation.

      if (currentSet?.setId) {
        await updateSet(currentSet.setId, formData as UpdateSetDto, imageFile || undefined);

        const existing = new Map<number, number>();
        for (const p of currentSetDetail?.products || []) {
          if (p.productId) existing.set(p.productId, p.quantity || 0);
        }

        const desired = new Map<number, number>();
        for (const item of selectedItems) {
          desired.set(item.productId, item.quantity);
        }

        for (const [productId, oldQty] of existing.entries()) {
          if (!desired.has(productId)) {
            await removeProductFromSet(currentSet.setId, productId);
          } else {
            const newQty = desired.get(productId) || 0;
            if (newQty !== oldQty) {
              await updateSetProductQuantity(currentSet.setId, productId, newQty);
            }
          }
        }

        for (const [productId, qty] of desired.entries()) {
          if (!existing.has(productId)) {
            const payload: CreateSetProductDto = { productId, quantity: qty };
            await addProductToSet(currentSet.setId, payload);
          }
        }

      } else {
        const result = await createSet(formData as CreateSetDto, imageFile || undefined);

        if (!result?.setId) {
          throw new Error('Created setId not returned from API');
        }

        for (const item of selectedItems) {
          const payload: CreateSetProductDto = { productId: item.productId, quantity: item.quantity };
          await addProductToSet(result.setId, payload);
        }
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save set');
    } finally {
      setLoading(false);
    }
  };

  // --- Reactivate modal helpers ---
  const openReactivateModal = async (set: ViewSetDetailDto) => {
    setReactivateSet(set);
    setReactivatePreview(null);
    setSelectedProductIds(new Set());
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const preview = await getSetReactivatePreview(set.setId!);
      setReactivatePreview(preview);
      // Pre-select all inactive products by default
      setSelectedProductIds(new Set(preview.inactiveProducts.map(p => p.productId)));
    } catch (err) {
      console.error(err);
      setPreviewError('Không thể tải danh sách sản phẩm bị ảnh hưởng.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const toggleProduct = (productId: number) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const toggleAllProducts = (products: SetAffectedProductDto[]) => {
    setSelectedProductIds(prev =>
      prev.size === products.length ? new Set() : new Set(products.map(p => p.productId))
    );
  };

  const handleReactivateBulk = async () => {
    if (!reactivateSet?.setId) return;
    setReactivateLoading(true);
    try {
      await reactivateSetBulk({
        setId: reactivateSet.setId,
        productIdsToReactivate: Array.from(selectedProductIds),
      });
      setReactivateSet(null);
      setReactivatePreview(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      setPreviewError('Không thể kích hoạt lại bộ sưu tập.');
    } finally {
      setReactivateLoading(false);
    }
  };

  const openCreateModal = () => {
    setCurrentSet(null);
    setCurrentSetDetail(null);
    setFormData({
      Name: '',
      Description: '',
      DiscountPercent: 0
    });
    setImageFile(null);
    setSelectedItems([]);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (set: ViewSetDetailDto) => {
    setCurrentSet(set);
    setCurrentSetDetail(null);
    setFormData({
      Name: set.name || '',
      Description: set.description || '',
      DiscountPercent: set.discountPercent || 0
    });
    setImageFile(null);
    setSelectedItems([]);
    setError(null);
    setIsModalOpen(true);

    if (set.setId) {
      try {
        const detail = await getSetById(set.setId);
        setCurrentSetDetail(detail);
        if (detail.products) {
          setSelectedItems(
            detail.products
              .filter(p => (p.productId || 0) > 0)
              .map(p => ({ productId: p.productId || 0, quantity: p.quantity || 1 }))
          );
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load set details.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bộ sưu tập</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <Plus size={20} />
          Thêm bộ sưu tập
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {([
          { label: 'Tất cả', value: undefined },
          { label: 'Đang bán', value: 0 },
          { label: 'Ngừng bán', value: 1 },
        ] as { label: string; value: typeof statusFilter }[]).map(tab => (
          <button
            key={tab.label}
            onClick={() => { setStatusFilter(tab.value); navigate(location.pathname); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${statusFilter === tab.value
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
            placeholder="Tìm kiếm bộ sưu tập..."
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

      {loading && !isModalOpen ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <SetListTable
              sets={paginatedSets}
              onEdit={openEditModal}
              onDelete={(set) => {
                // Inactive sets use the reactivate modal; active sets use the simple deactivate confirm
                const rawStatus = (set as any).Status ?? (set as any).status;
                const isActive = rawStatus === 'Đang bán' || rawStatus === 'Active' || rawStatus === 0 || Number(rawStatus) === 0;
                if (!isActive) {
                  openReactivateModal(set);
                } else {
                  setConfirmSet(set);
                }
              }}
            />
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              const next = new URLSearchParams(location.search);
              next.set('page', String(nextPage));
              navigate(`${location.pathname}?${next.toString()}`);
            }}
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSet ? 'Chỉnh sửa bộ sưu tập' : 'Thêm bộ sưu tập'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên bộ sưu tập</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phần trăm giảm giá (%)</label>
            <input
              type="number"
              name="DiscountPercent"
              value={formData.DiscountPercent}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HÌnh ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {currentSet?.imageUrl && !imageFile && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                <img src={currentSet.imageUrl} alt="Current" className="h-20 rounded" />
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Thành phần bộ sưu tập</label>
              {currentSet && !currentSetDetail && (
                <span className="text-xs text-gray-500">Loading items...</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                const init: Record<number, number> = {};
                selectedItems.forEach(i => { init[i.productId] = i.quantity; });
                setPendingSelectionQtys(init);
                setProductTableSearch('');
                setIsProductTableModalOpen(true);
              }}
              className="w-full px-4 py-2.5 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
            >
              + Chọn sản phẩm từ danh sách {selectedItems.length > 0 && `(${selectedItems.length} đã chọn)`}
            </button>

            {selectedItems.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedItems.map(item => {
                  const product = products.find(p => p.productId === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{product?.name || `Product #${item.productId}`}</div>
                        <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedItems(prev => prev.filter(i => i.productId !== item.productId))}
                        className="text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
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
              disabled={loading || selectedItems.length === 0}
              className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black disabled:opacity-50"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Đang xử lý...' : 'Lưu bộ sưu tập'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Product Selection Table Modal */}
      <Modal
        isOpen={isProductTableModalOpen}
        onClose={() => setIsProductTableModalOpen(false)}
        title="Chọn sản phẩm cho bộ sưu tập"
        size="xl"
      >
        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={productTableSearch}
            onChange={e => setProductTableSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
        </div>

        {/* Product table */}
        <div className="overflow-y-auto max-h-[420px] border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="w-10 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={
                      products.filter(p => (p.productId || 0) > 0).length > 0 &&
                      products
                        .filter(p => (p.productId || 0) > 0)
                        .filter(p => !productTableSearch.trim() || p.name?.toLowerCase().includes(productTableSearch.toLowerCase()))
                        .every(p => !!pendingSelectionQtys[p.productId!])
                    }
                    onChange={e => {
                      const visible = products
                        .filter(p => (p.productId || 0) > 0)
                        .filter(p => !productTableSearch.trim() || p.name?.toLowerCase().includes(productTableSearch.toLowerCase()));
                      if (e.target.checked) {
                        setPendingSelectionQtys(prev => {
                          const next = { ...prev };
                          visible.forEach(p => { if (!next[p.productId!]) next[p.productId!] = 1; });
                          return next;
                        });
                      } else {
                        setPendingSelectionQtys(prev => {
                          const next = { ...prev };
                          visible.forEach(p => { delete next[p.productId!]; });
                          return next;
                        });
                      }
                    }}
                  />
                </th>
                <th className="w-14 px-2 py-2"></th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Tên sản phẩm</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">Giá</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 w-24">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(p => (p.productId || 0) > 0)
                .filter(p => !productTableSearch.trim() || p.name?.toLowerCase().includes(productTableSearch.toLowerCase()))
                .map(p => {
                  const pid = p.productId!;
                  const isChecked = !!pendingSelectionQtys[pid];
                  const qty = pendingSelectionQtys[pid] ?? 1;
                  return (
                    <tr
                      key={pid}
                      className={`border-b border-gray-100 transition-colors cursor-pointer ${isChecked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        if (isChecked) {
                          setPendingSelectionQtys(prev => { const n = { ...prev }; delete n[pid]; return n; });
                        } else {
                          setPendingSelectionQtys(prev => ({ ...prev, [pid]: 1 }));
                        }
                      }}
                    >
                      <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setPendingSelectionQtys(prev => { const n = { ...prev }; delete n[pid]; return n; });
                            } else {
                              setPendingSelectionQtys(prev => ({ ...prev, [pid]: 1 }));
                            }
                          }}
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name || ''} className="h-10 w-10 object-cover rounded" />
                          : <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">N/A</div>
                        }
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-800">{p.name}</div>
                        {p.brandName && <div className="text-xs text-gray-400">{p.brandName}</div>}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 whitespace-nowrap">
                        {p.price?.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                        {isChecked ? (
                          <input
                            type="number"
                            min={1}
                            value={qty}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              const val = Math.max(1, Number(e.target.value));
                              setPendingSelectionQtys(prev => ({ ...prev, [pid]: val }));
                            }}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              {products.filter(p =>
                (p.productId || 0) > 0 &&
                (!productTableSearch.trim() || p.name?.toLowerCase().includes(productTableSearch.toLowerCase()))
              ).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-gray-400">Không tìm thấy sản phẩm</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Đã chọn: <span className="font-semibold text-blue-600">{Object.keys(pendingSelectionQtys).length}</span> sản phẩm
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsProductTableModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors text-sm"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                const newItems = Object.entries(pendingSelectionQtys)
                  .filter(([, qty]) => qty > 0)
                  .map(([pid, qty]) => ({ productId: Number(pid), quantity: qty }));
                setSelectedItems(newItems);
                setIsProductTableModalOpen(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              Xác nhận ({Object.keys(pendingSelectionQtys).length})
            </button>
          </div>
        </div>
      </Modal>

      {/* Vietnamese confirmation modal for status toggle */}
      <Modal
        isOpen={confirmSet !== null}
        onClose={() => setConfirmSet(null)}
        title="Bạn có chắc chắn muốn ngừng bán bộ sưu tập này không?"
        size="sm"
      >
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => setConfirmSet(null)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirmSet?.setId) return;
              const target = confirmSet;
              setConfirmSet(null);
              try {
                setLoading(true);
                setError(null);
                await deleteSet(target.setId!);
                await fetchData();
              } catch (err) {
                console.error(err);
                setError('Không thể thay đổi trạng thái bộ sưu tập');
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 text-white rounded-lg transition-colors font-semibold bg-red-500 hover:bg-red-600"
          >
            Đồng ý
          </button>
        </div>
      </Modal>

      {/* Reactivate Set Modal — shows inactive products with checkboxes */}
      <Modal
        isOpen={reactivateSet !== null}
        onClose={() => { setReactivateSet(null); setReactivatePreview(null); }}
        title={`Kích hoạt bộ sưu tập: ${reactivateSet?.name || ''}`}
        size="lg"
      >
        {previewLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải danh sách sản phẩm...</div>
        ) : previewError ? (
          <div className="text-red-600 text-sm py-4">{previewError}</div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Bộ sưu tập này sẽ được kích hoạt lại. Chọn các sản phẩm bạn muốn kích hoạt đồng thời:
            </p>

            {reactivatePreview && reactivatePreview.inactiveProducts.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Sản phẩm đang ngừng bán ({reactivatePreview.inactiveProducts.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAllProducts(reactivatePreview.inactiveProducts)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {selectedProductIds.size === reactivatePreview.inactiveProducts.length
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                </div>
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {reactivatePreview.inactiveProducts.map(p => (
                    <li
                      key={p.productId}
                      onClick={() => toggleProduct(p.productId)}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors border-l-4 ${selectedProductIds.has(p.productId)
                          ? 'bg-green-50 border-green-500'
                          : 'bg-white border-transparent hover:bg-gray-50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProductIds.has(p.productId)}
                        onChange={() => toggleProduct(p.productId)}
                        onClick={e => e.stopPropagation()}
                        className="accent-green-500"
                      />
                      <span className="text-sm text-gray-800">{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Không có sản phẩm nào đang ngừng bán trong bộ sưu tập này.
              </p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => { setReactivateSet(null); setReactivatePreview(null); }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={reactivateLoading}
                onClick={handleReactivateBulk}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {reactivateLoading ? 'Đang xử lý...' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SetManagementPage;
