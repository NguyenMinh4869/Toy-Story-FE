import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<ViewBrandDto | null>(null);
  const [formData, setFormData] = useState<Partial<CreateBrandDto>>({ name: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    </div>
  );
};

export default BrandManagementPage;
