import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import BrandListTable from '../../components/admin/BrandListTable';
import Modal from '../../components/ui/Modal';
import { 
  createBrand, 
  updateBrand, 
  changeBrandStatus, 
  filterBrands 
} from '../../services/brandService';
import Pagination from '../../components/ui/Pagination';
import type { ViewBrandDto, CreateBrandDto, UpdateBrandDto } from '../../types/BrandDTO';

const PAGE_SIZE = 10;

const BrandManagementPage: React.FC = () => {
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') || String(PAGE_SIZE)));

  const paginatedBrands = useMemo(() => {
    const start = (page - 1) * pageSize;
    return brands.slice(start, start + pageSize);
  }, [brands, page, pageSize]);

  const totalPages = Math.ceil(brands.length / pageSize);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<ViewBrandDto | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<CreateBrandDto>>({
    name: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams(location.search).get('q') || '';
      const allBrands = q.trim()
        ? await filterBrands({ name: q.trim() })
        : await filterBrands({});
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
    try {
      setError(null);
      await changeBrandStatus(id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to change brand status');
    }
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Brand Management</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Brand
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBrand ? 'Edit Brand' : 'Add New Brand'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Brand'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BrandManagementPage;
