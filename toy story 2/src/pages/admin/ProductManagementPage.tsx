import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import { Plus, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import ProductListTable from '../../components/admin/ProductListTable';
import Modal from '../../components/ui/Modal';
import {
  createProduct,
  updateProduct,
  changeProductStatus,
  filterProducts,
  getProductById,
  getProductDeactivatePreview,
  type ProductAffectedSetDto,
} from '../../services/productService';
import { getActiveBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import { adminFilterSets, reactivateSetBulk } from '../../services/setService';
import type { ViewProductDto, CreateProductDto, UpdateProductDto, GenderTarget, AgeRange } from '../../types/ProductDTO';
import type { ViewBrandDto } from '../../types/BrandDTO';
import type { ViewCategoryDto } from '../../types/CategoryDTO';
import type { ViewSetDetailDto } from '../../types/SetDTO';
import { useClientPagination } from '../../hooks/useClientPagination';

const PAGE_SIZE = 5;

const ProductManagementPage: React.FC = () => {
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [categories, setCategories] = useState<ViewCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') || String(PAGE_SIZE)));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ViewProductDto | null>(null);

  // Deactivate / Activate modal state
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedProductToToggle, setSelectedProductToToggle] = useState<ViewProductDto | null>(null);
  const [affectedSets, setAffectedSets] = useState<ProductAffectedSetDto[]>([]);
  const [isCheckingSets, setIsCheckingSets] = useState(false);

  // Activate modal — inactive sets preview
  const [activatePreviewSets, setActivatePreviewSets] = useState<ViewSetDetailDto[]>([]);
  const [isLoadingActivateSets, setIsLoadingActivateSets] = useState(false);
  const [selectedSetIds, setSelectedSetIds] = useState<Set<number>>(new Set());
  const [isActivating, setIsActivating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    Name: '',
    Description: '',
    Price: 0,
    Origin: '',
    Material: '',
    Gender: 0 as GenderTarget,
    AgeRange: 0 as AgeRange,
    CategoryId: 0,
    BrandId: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [allProducts, setAllProducts] = useState<ViewProductDto[]>([]);
  // 0 = Active, 1 = Inactive, 2 = OutOfStock (matches C# ProductStatus enum $int32)
  const [statusFilter, setStatusFilter] = useState<0 | 1 | 2 | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<number | undefined>(undefined);
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    fetchData();
  }, [statusFilter, debouncedSearch, brandFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandsData, categoriesData, productsData] = await Promise.all([
        getActiveBrands(),
        getCategories(),
        filterProducts({
          status: statusFilter,
          ...(debouncedSearch.trim() ? { searchTerm: debouncedSearch.trim() } : {}),
          ...(brandFilter !== undefined ? { brandId: brandFilter } : {}),
        })
      ]);
      setAllProducts(productsData);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
      setFetchError('Không thể tải dữ liệu, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Price' || name === 'CategoryId' || name === 'BrandId' || name === 'Gender' || name === 'AgeRange'
        ? Number(value)
        : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (!formData.Name?.trim()) missing.push('Tên sản phẩm');
    if (!formData.Price || formData.Price <= 0) missing.push('Giá tiền');
    if (!formData.Description?.trim()) missing.push('Mô tả');
    if (!formData.Origin?.trim()) missing.push('Xuất xứ');
    if (!formData.CategoryId || formData.CategoryId <= 0) missing.push('Phân loại');
    if (!formData.BrandId || formData.BrandId <= 0) missing.push('Thương hiệu');
    if (missing.length > 0) {
      setFormError(`Vui lòng điền đầy đủ: ${missing.join(', ')}`);
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError(null);
      if (currentProduct && currentProduct.productId) {
        await updateProduct(currentProduct.productId, formData as UpdateProductDto, imageFile || undefined, true);
      } else {
        await createProduct(formData as CreateProductDto, imageFile || undefined, true);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || 'Lưu sản phẩm thất bại, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    paginatedItems: paginatedProducts,
    totalPages,
    currentPage: safePage
  } = useClientPagination(allProducts, page, PAGE_SIZE)

  const handleStatusChange = async (id: number) => {
    const product = allProducts.find(p => p.productId === id);
    if (!product) return;
    const isActive = product.status?.toLowerCase() === 'đang bán' || product.status?.toLowerCase() === 'active';

    if (isActive && product.productId) {
      setSelectedProductToToggle(product);
      setAffectedSets([]);
      setIsCheckingSets(true);
      setIsDeactivateModalOpen(true);
      try {
        const preview = await getProductDeactivatePreview(product.productId);
        setAffectedSets(preview.affectedSets);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCheckingSets(false);
      }
    } else {
      setSelectedProductToToggle(product);
      setActivatePreviewSets([]);
      setSelectedSetIds(new Set());
      setIsLoadingActivateSets(true);
      setIsActivateModalOpen(true);
      try {
        const allInactiveSets = await adminFilterSets({ status: 1 });
        const related = allInactiveSets.filter(s =>
          s.products?.some(p => p.productId === product.productId)
        );
        setActivatePreviewSets(related);
        setSelectedSetIds(new Set(related.map(s => s.setId!)));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingActivateSets(false);
      }
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedProductToToggle?.productId) return;
    try {
      await changeProductStatus(selectedProductToToggle.productId);
      await fetchData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsDeactivateModalOpen(false);
      setSelectedProductToToggle(null);
      setAffectedSets([]);
    }
  };

  const handleConfirmActivate = async () => {
    if (!selectedProductToToggle?.productId) return;
    setIsActivating(true);
    try {
      await changeProductStatus(selectedProductToToggle.productId);
      if (selectedSetIds.size > 0) {
        await Promise.all(
          Array.from(selectedSetIds).map(setId =>
            reactivateSetBulk({ setId, productIdsToReactivate: [] })
          )
        );
      }
      await fetchData();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsActivateModalOpen(false);
      setSelectedProductToToggle(null);
      setActivatePreviewSets([]);
      setSelectedSetIds(new Set());
      setIsActivating(false);
    }
  };

  const openCreateModal = () => {
    setCurrentProduct(null);
    setFormData({
      Name: '',
      Description: '',
      Price: 0,
      Origin: '',
      Material: '',
      Gender: 0 as GenderTarget,
      AgeRange: 0 as AgeRange,
      CategoryId: categories[0]?.categoryId || 0,
      BrandId: brands[0]?.brandId || 0
    });
    setImageFile(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (product: ViewProductDto) => {
    setCurrentProduct(product);
    setFormError(null);
    try {
      setLoading(true);
      const details = product.productId ? await getProductById(product.productId) : product;
      setFormData({
        Name: details.name || '',
        Description: details.description || '',
        Price: details.price || 0,
        Origin: details.origin || '',
        Material: details.material || '',
        Gender: details.genderTarget ?? 0,
        AgeRange: details.ageRangeValue ?? 0,
        CategoryId: details.categoryId || 0,
        BrandId: details.brandId || 0
      });
      setImageFile(null);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setFetchError('Không thể tải chi tiết sản phẩm, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">Quản lý sản phẩm</h1>
        <button
          onClick={openCreateModal}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <Plus size={20} /> Thêm sản phẩm
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
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); navigate(location.pathname); }}
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-red-400 w-56"
          />
        </div>
        <select
          value={brandFilter ?? ''}
          onChange={e => { setBrandFilter(e.target.value ? Number(e.target.value) : undefined); navigate(location.pathname); }}
          className="px-3 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-red-400"
        >
          <option value="">Tất cả thương hiệu</option>
          {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.name}</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}
      {fetchError && <div className="text-center py-4 text-red-500">{fetchError}</div>}

      {!loading && !fetchError && (
        <>
          <ProductListTable
            products={paginatedProducts}
            onEdit={openEditModal}
            onStatusChange={handleStatusChange}
          />
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              const next = new URLSearchParams(location.search)
              next.set('page', String(nextPage))
              next.set('pageSize', String(pageSize))
              navigate(`${location.pathname}?${next.toString()}`)
            }}
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setFormError(null); }}
        title={currentProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        size="xxl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên</label>
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
                  <label className="block text-sm font-medium text-gray-700">Giá tiền</label>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phân loại</label>
                  <select
                    name="CategoryId"
                    value={formData.CategoryId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value={0}>Select Category</option>
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Độ tuổi</label>
                  <select
                    name="AgeRange"
                    value={formData.AgeRange}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value={0}>0-6 tháng</option>
                    <option value={1}>6-12 tháng</option>
                    <option value={2}>1-3 tuổi</option>
                    <option value={3}>3-6 tuổi</option>
                    <option value={4}>Trên 6 tuổi</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                  <select
                    name="BrandId"
                    value={formData.BrandId}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value={0}>Select Brand</option>
                    {brands.map(b => (
                      <option key={b.brandId} value={b.brandId}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Xuất xứ</label>
                  <input
                    type="text"
                    name="Origin"
                    value={formData.Origin}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Chất lượng</label>
                  <input
                    type="text"
                    name="Material"
                    value={formData.Material}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value={0}>Nam</option>
                    <option value={1}>Nữ</option>
                    <option value={2}>Unisex</option>
                  </select>
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
                {currentProduct?.imageUrl && !imageFile ? (
                  <img
                    src={currentProduct.imageUrl}
                    alt="Current"
                    className="h-full w-full min-h-[320px] rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-4 text-center text-sm text-gray-500">
                    Chon mot hinh anh de hien thi o day
                  </div>
                )}
              </div>
            </div>
          </div>

          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setFormError(null); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black disabled:opacity-50"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Đang xử lý...' : (currentProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Smart Deactivate Modal */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => { setIsDeactivateModalOpen(false); setSelectedProductToToggle(null); setAffectedSets([]); }}
        title="Vô hiệu hóa sản phẩm"
        size="sm"
      >
        <div className="space-y-4">
          {isCheckingSets ? (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <svg className="animate-spin h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-gray-500">Đang kiểm tra dữ liệu liên quan...</p>
            </div>
          ) : affectedSets.length > 0 ? (
            <>
              <div className="flex items-start gap-3 rounded-xl bg-orange-50 border border-orange-200 p-3">
                <svg className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-orange-700">
                    Cảnh báo: Sản phẩm đang thuộc {affectedSets.length} bộ sưu tập
                  </p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    Nếu vô hiệu hóa, các bộ sưu tập này có thể bị ảnh hưởng.
                  </p>
                </div>
              </div>
              <ul className="max-h-40 overflow-y-auto space-y-1">
                {affectedSets.map(s => (
                  <li key={s.setId} className="flex items-center gap-2 text-sm text-gray-800">
                    <span className="h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
                    {s.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-gray-700">
              Bạn có chắc chắn muốn vô hiệu hóa sản phẩm{' '}
              <span className="font-semibold text-gray-900">&ldquo;{selectedProductToToggle?.name}&rdquo;</span>?{' '}
              Sản phẩm này hiện không nằm trong bộ sưu tập nào.
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setIsDeactivateModalOpen(false); setSelectedProductToToggle(null); setAffectedSets([]); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmDeactivate}
              disabled={isCheckingSets}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-2xl hover:bg-red-600 disabled:opacity-50"
            >
              Xác nhận vô hiệu hóa
            </button>
          </div>
        </div>
      </Modal>

      {/* Activate Modal — selectable inactive sets */}
      <Modal
        isOpen={isActivateModalOpen}
        onClose={() => {
          setIsActivateModalOpen(false);
          setSelectedProductToToggle(null);
          setActivatePreviewSets([]);
          setSelectedSetIds(new Set());
        }}
        title={`Kích hoạt sản phẩm: ${selectedProductToToggle?.name || ''}`}
        size="lg"
      >
        {isLoadingActivateSets ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-gray-500">Đang kiểm tra dữ liệu liên quan...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sản phẩm này sẽ được kích hoạt lại. Chọn các bộ sưu tập liên quan mà bạn muốn kích hoạt đồng thời:
            </p>

            {activatePreviewSets.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Bộ sưu tập đang ngừng bán ({activatePreviewSets.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSetIds(prev =>
                        prev.size === activatePreviewSets.length
                          ? new Set()
                          : new Set(activatePreviewSets.map(s => s.setId!))
                      )
                    }
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {selectedSetIds.size === activatePreviewSets.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>
                <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {activatePreviewSets.map(s => (
                    <li
                      key={s.setId}
                      onClick={() =>
                        setSelectedSetIds(prev => {
                          const next = new Set(prev);
                          next.has(s.setId!) ? next.delete(s.setId!) : next.add(s.setId!);
                          return next;
                        })
                      }
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors border-l-4 ${
                        selectedSetIds.has(s.setId!)
                          ? 'bg-green-50 border-green-500'
                          : 'bg-white border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSetIds.has(s.setId!)}
                        onChange={() => {}}
                        onClick={e => e.stopPropagation()}
                        className="accent-green-500"
                      />
                      <span className="text-sm text-gray-800">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Không có bộ sưu tập nào cần kích hoạt lại.</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsActivateModalOpen(false);
                  setSelectedProductToToggle(null);
                  setActivatePreviewSets([]);
                  setSelectedSetIds(new Set());
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isActivating}
                onClick={handleConfirmActivate}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isActivating ? 'Đang xử lý...' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagementPage;
