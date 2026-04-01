import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import PromotionListTable from '../../components/admin/PromotionListTable';
import Modal from '../../components/ui/Modal';
import {
  adminFilterPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  changePromotionStatus,
} from '../../services/promotionService';
import { getActiveBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { getActiveProducts } from '../../services/productService';
import type {
  ViewPromotionSummaryDto,
  CreatePromotionDto,
  UpdatePromotionDto,
  DiscountType,
} from '../../types/PromotionDTO';
import { runAsync } from '../../utils/runAsync';
import type { ViewBrandDto } from '../../types/BrandDTO';
import type { ViewCategoryDto } from '../../types/CategoryDTO';
import type { ViewProductDto } from '../../types/ProductDTO';
import Pagination from '../../components/ui/Pagination';

const PAGE_SIZE = 10;

const PromotionManagementPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionSummaryDto[]>([]);
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [categories, setCategories] = useState<ViewCategoryDto[]>([]);
  const [products, setProducts] = useState<ViewProductDto[]>([]);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const debouncedSearch = useDebounce(searchTerm, 400);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const q = searchParams.get('q') || '';

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

  const filteredPromotions = useMemo(() => {
    if (!q) return promotions;
    return promotions.filter(p => 
        p.name?.toLowerCase().includes(q.toLowerCase())
    );
  }, [promotions, q]);

  const paginatedPromotions = useMemo(() => {
      const start = (page - 1) * PAGE_SIZE;
      return filteredPromotions.slice(start, start + PAGE_SIZE);
  }, [filteredPromotions, page]);

  const totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromotionId, setCurrentPromotionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreatePromotionDto>({
    Name: '',
    Description: '',
    DiscountType: 0 as DiscountType,
    DiscountValue: 0,
    MinimumQuantity: 0,
    MinimumAmount: 0,
    BrandId: undefined,
    CategoryId: undefined,
    ProductId: undefined,
    StartDate: '',
    EndDate: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getDiscountValueLabel = () => {
    switch (Number(formData.DiscountType)) {
      case 0: return "Giá trị giảm (%)";
      case 1: return "Giá trị giảm (VNĐ)";
      case 2: return "Mức giảm phí ship tối đa (VNĐ)";
      case 3: return "Số lượng tặng (Mua X tặng Y)";
      default: return "Giá trị giảm";
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promotionsData, brandsData, categoriesData, productsData] = await Promise.all([
        adminFilterPromotions({ isActive: isActiveFilter }),
        getActiveBrands(),
        getCategories(),
        getActiveProducts(),
      ]);
      setPromotions(promotionsData);
      setBrands(brandsData);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isActiveFilter]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let newValue: any = value;
      if (
        ['DiscountType', 'DiscountValue', 'MinimumQuantity', 'MinimumAmount', 'BrandId', 'CategoryId', 'ProductId'].includes(name)
      ) {
        newValue = value === '' ? undefined : Number(value);
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      DiscountType: 0 as DiscountType,
      DiscountValue: 0,
      MinimumQuantity: 0,
      MinimumAmount: 0,
      BrandId: undefined,
      CategoryId: undefined,
      ProductId: undefined,
      StartDate: '',
      EndDate: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setCurrentPromotionId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = async (promotion: ViewPromotionSummaryDto) => {
    if (!promotion.promotionId) return;
    try {
      const details = await getPromotionById(promotion.promotionId);
      setFormData({
        Name: details.name || '',
        Description: details.description || '',
        DiscountType: (details.discountType as DiscountType) || 0,
        DiscountValue: details.discountValue || 0,
        MinimumQuantity: details.minimumQuantity || 0,
        MinimumAmount: details.minimumAmount || 0,
        BrandId: details.brandId || undefined,
        CategoryId: details.categoryId || undefined,
        ProductId: details.productId || undefined,
        StartDate: details.startDate ? details.startDate.split('T')[0] : '',
        EndDate: details.endDate ? details.endDate.split('T')[0] : '',
      });
      // Try to set image preview if there is an existing image (assume imageUrl field exists)
      setImagePreview((details as any).imageUrl || null);
      setCurrentPromotionId(promotion.promotionId);
      setIsEditing(true);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch promotion details');
    }
  };


  const handleStatusChange = async (id: number) => {
    await runAsync(async () => {
      await changePromotionStatus(id);
      await fetchData();
    }, setError, 'Failed to update status');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing && currentPromotionId) {
        const updateData: UpdatePromotionDto = { ...formData };
        await updatePromotion(currentPromotionId, updateData, imageFile || undefined);
      } else {
        await createPromotion(formData, imageFile || undefined);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save promotion');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">Quản lý khuyến mãi</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Thêm khuyến mãi
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {([
          { label: 'Tất cả', value: undefined },
          { label: 'Đang hoạt động', value: true },
          { label: 'Ngừng hoạt động', value: false },
        ] as { label: string; value: typeof isActiveFilter }[]).map(tab => (
          <button
            key={tab.label}
            onClick={() => { setIsActiveFilter(tab.value); navigate(location.pathname); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              isActiveFilter === tab.value
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
            placeholder="Tìm kiếm khuyến mãi..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-red-400 w-56"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : paginatedPromotions.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No promotions found.</div>
      ) : (
        <>
          <PromotionListTable
            promotions={paginatedPromotions}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
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
        title={isEditing ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
        size="xxl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên khuyến mãi</label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại giảm giá</label>
                  <select
                    name="DiscountType"
                    value={formData.DiscountType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value={0}>Phần trăm</option>
                    <option value={1}>Số tiền cố định</option>
                    <option value={2}>Miễn phí vận chuyển</option>
                    <option value={3}>Mua X tặng Y</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {getDiscountValueLabel()}
                  </label>
                  <input
                    type="number"
                    name="DiscountValue"
                    value={formData.DiscountValue}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số lượng tối thiểu</label>
                  <input
                    type="number"
                    name="MinimumQuantity"
                    value={formData.MinimumQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số tiền tối thiểu</label>
                  <input
                    type="number"
                    name="MinimumAmount"
                    value={formData.MinimumAmount}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                  <select
                    name="BrandId"
                    value={formData.BrandId || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value="">Không</option>
                    {brands.map((brand) => (
                      <option key={brand.brandId} value={brand.brandId}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phân loại</label>
                  <select
                    name="CategoryId"
                    value={formData.CategoryId || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value="">Không</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sản phẩm</label>
                  <select
                    name="ProductId"
                    value={formData.ProductId || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value="">Không</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                  <input
                    type="date"
                    name="StartDate"
                    value={formData.StartDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                  <input
                    type="date"
                    name="EndDate"
                    value={formData.EndDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <div className="mt-4 flex-1">
                 <div className="flex h-full min-h-[320px] max-h-[400px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white overflow-hidden text-center text-sm text-gray-500">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      "Chọn một hình ảnh để hiển thị ở đây"
                    )}
                 </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PromotionManagementPage;
