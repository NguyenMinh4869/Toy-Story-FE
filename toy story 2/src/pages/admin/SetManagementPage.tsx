import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SetListTable from '../../components/admin/SetListTable';
import Modal from '../../components/ui/Modal';
import { 
  getSets, 
  getSetById,
  createSet,
  updateSet,
  addProductToSet,
  removeProductFromSet,
  updateSetProductQuantity,
  deleteSet,
} from '../../services/setService';
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [totalStockByProductId, setTotalStockByProductId] = useState<Record<number, number>>({});
  const location = useLocation();
  const navigate = useNavigate();

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
  const [pendingAddProductId, setPendingAddProductId] = useState<number>(0);
  const [pendingAddQuantity, setPendingAddQuantity] = useState<number>(1);
  const [setItemError, setSetItemError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();

    // Fetch all products for the dropdown in the modal
    filterProducts({ status: 'Active' })
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

        setTotalStockByProductId(totals);
      } catch (e) {
        console.error(e);
        // Do not block set creation if stock cannot be loaded.
      }
    })();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSets();
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
    try {
      setLoading(true);
      setError(null);

      // Final validation before submit
      for (const item of selectedItems) {
        const available = totalStockByProductId[item.productId] ?? 0;
        if (available > 0 && item.quantity > available) {
          const product = products.find(p => p.productId === item.productId);
          setError(`Cannot save: quantity for "${product?.name || 'a product'}" (${item.quantity}) exceeds total stock (${available}).`);
          setLoading(false);
          return;
        }
      }

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
    setPendingAddProductId(0);
    setPendingAddQuantity(1);
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
    setPendingAddProductId(0);
    setPendingAddQuantity(1);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Set Management</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Set
        </button>
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
              onDelete={async (set) => {
                if (!set.setId) return;
                if (!confirm(`Delete set "${set.name || set.setId}"?`)) return;
                try {
                  setLoading(true);
                  setError(null);
                  await deleteSet(set.setId);
                  await fetchData();
                } catch (err) {
                  console.error(err);
                  setError('Failed to delete set');
                } finally {
                  setLoading(false);
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
        title={currentSet ? 'Edit Set' : 'Add New Set'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Set Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percent (%)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
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
              <label className="block text-sm font-medium text-gray-700">Set Items</label>
              {currentSet && !currentSetDetail && (
                <span className="text-xs text-gray-500">Loading items...</span>
              )}
            </div>

            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-7">
                <label className="block text-xs text-gray-600 mb-1">Product</label>
                <select
                  value={pendingAddProductId}
                  onChange={(e) => {
                    setPendingAddProductId(Number(e.target.value));
                    setSetItemError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Select product</option>
                  {products
                    .filter(p => {
                      const pid = p.productId || 0;
                      if (pid <= 0) return false;
                      return (totalStockByProductId[pid] ?? 0) > 0;
                    })
                    .map(p => (
                      <option key={p.productId} value={p.productId || 0}>
                        {p.name} (Stock: {totalStockByProductId[p.productId || 0] ?? 0})
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-span-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-gray-600">Qty</label>
                  {pendingAddProductId ? (
                    <span className="text-[11px] text-gray-500">
                      Max: {totalStockByProductId[pendingAddProductId] ?? 0}
                    </span>
                  ) : null}
                </div>
                <input
                  type="number"
                  min={1}
                  max={pendingAddProductId ? (totalStockByProductId[pendingAddProductId] ?? undefined) : undefined}
                  value={pendingAddQuantity}
                  onChange={(e) => {
                    setPendingAddQuantity(Number(e.target.value));
                    setSetItemError(null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="button"
                  disabled={!pendingAddProductId || (totalStockByProductId[pendingAddProductId] ?? 0) <= 0}
                  onClick={() => {
                    if (!pendingAddProductId) return;
                    if (pendingAddQuantity < 1) return;

                    const available = totalStockByProductId[pendingAddProductId] ?? 0;
                    const existingQty = selectedItems.find(i => i.productId === pendingAddProductId)?.quantity ?? 0;
                    const desiredQty = existingQty + pendingAddQuantity;

                    if (available <= 0) {
                      setSetItemError('This product has no stock available.');
                      return;
                    }

                    if (desiredQty > available) {
                      setSetItemError(`Quantity cannot exceed total stock (${available}).`);
                      return;
                    }

                    setSelectedItems(prev => {
                      const existing = prev.find(i => i.productId === pendingAddProductId);
                      if (existing) {
                        return prev.map(i => i.productId === pendingAddProductId ? { ...i, quantity: i.quantity + pendingAddQuantity } : i);
                      }
                      return [...prev, { productId: pendingAddProductId, quantity: pendingAddQuantity }];
                    });

                    setPendingAddProductId(0);
                    setPendingAddQuantity(1);
                    setSetItemError(null);
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {setItemError && (
              <div className="mt-2 text-sm text-red-600">{setItemError}</div>
            )}

            {selectedItems.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedItems.map(item => {
                  const product = products.find(p => p.productId === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{product?.name || `Product #${item.productId}`}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedItems(prev => prev.filter(i => i.productId !== item.productId))}
                        className="text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || selectedItems.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Set'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SetManagementPage;
