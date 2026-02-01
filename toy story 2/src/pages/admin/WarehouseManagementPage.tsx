import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import WarehouseListTable from '../../components/admin/WarehouseListTable';
import Modal from '../../components/ui/Modal';
import { 
  getWarehouses, 
  createWarehouse, 
  updateWarehouse, 
  updateWarehouseLowStockThreshold,
  deleteWarehouse,
  getWarehouseById 
} from '../../services/warehouseService';
import Pagination from '../../components/ui/Pagination';
import type { WarehouseSummaryDto, CreateWarehouseDto, UpdateWarehouseDto } from '../../types/WarehouseDTO';
import { confirmAction } from '../../utils/confirmAction';
import { runAsync } from '../../utils/runAsync';

const PAGE_SIZE = 10;

const WarehouseManagementPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const q = searchParams.get('q') || '';

  const filteredWarehouses = useMemo(() => {
    if (!q) return warehouses;
    return warehouses.filter(w => 
        w.name?.toLowerCase().includes(q.toLowerCase()) ||
        w.location?.toLowerCase().includes(q.toLowerCase())
    );
  }, [warehouses, q]);

  const paginatedWarehouses = useMemo(() => {
      const start = (page - 1) * PAGE_SIZE;
      return filteredWarehouses.slice(start, start + PAGE_SIZE);
  }, [filteredWarehouses, page]);

  const totalPages = Math.ceil(filteredWarehouses.length / PAGE_SIZE);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState<WarehouseSummaryDto | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<CreateWarehouseDto>({
    Name: '',
    Location: ''
  });
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(20);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load warehouses');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentWarehouse && currentWarehouse.warehouseId) {
        await updateWarehouse(currentWarehouse.warehouseId, {
          ...(formData as UpdateWarehouseDto),
          LowStockThreshold: lowStockThreshold,
        });
        await updateWarehouseLowStockThreshold(currentWarehouse.warehouseId, lowStockThreshold);
      } else {
        await createWarehouse({
          ...(formData as CreateWarehouseDto),
          LowStockThreshold: lowStockThreshold,
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save warehouse');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWarehouse = async (id: number) => {
    await confirmAction('Are you sure you want to delete this warehouse?', async () => {
      await runAsync(async () => {
        setError(null)
        await deleteWarehouse(id)
        await fetchData()
      }, setError, 'Failed to delete warehouse')
    })
  };

  const openCreateModal = () => {
    setCurrentWarehouse(null);
    setFormData({
      Name: '',
      Location: ''
    });
    setLowStockThreshold(20);
    setIsModalOpen(true);
  };

  const openEditModal = async (warehouse: WarehouseSummaryDto) => {
    setCurrentWarehouse(warehouse);
    setFormData({
      Name: warehouse.name || '',
      Location: warehouse.location || ''
    });
    setLowStockThreshold(20);
    setIsModalOpen(true);

    if (warehouse.warehouseId) {
      try {
        const detail = await getWarehouseById(warehouse.warehouseId);
        setLowStockThreshold(detail.lowStockThreshold ?? 20);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Warehouse Management</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Warehouse
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
            <WarehouseListTable 
              warehouses={paginatedWarehouses} 
              onEdit={openEditModal} 
              onDelete={handleDeleteWarehouse} 
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
        title={currentWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="Location"
              value={formData.Location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
            <input
              type="number"
              min={0}
              name="LowStockThreshold"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Warehouse'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WarehouseManagementPage;
