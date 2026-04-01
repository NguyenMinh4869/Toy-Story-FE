import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import { Plus } from 'lucide-react';
import ProductListTable from '../../components/admin/ProductListTable';
import Modal from '../../components/ui/Modal';
import {
  createProduct,
  updateProduct,
  changeProductStatus,
  filterProducts,
  getProductById
} from '../../services/productService';
import { getActiveBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import type { ViewProductDto, CreateProductDto, UpdateProductDto, GenderTarget, AgeRange } from '../../types/ProductDTO';
import type { ViewBrandDto } from '../../types/BrandDTO';
import type { ViewCategoryDto } from '../../types/CategoryDTO';
import { confirmAction } from '../../utils/confirmAction';
import { runAsync } from '../../utils/runAsync';
import { useClientPagination } from '../../hooks/useClientPagination';

const PAGE_SIZE = 5;

const ProductManagementPage: React.FC = () => {
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [categories, setCategories] = useState<ViewCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.max(1, Number(searchParams.get('pageSize') || String(PAGE_SIZE)));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ViewProductDto | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandsData, categoriesData, productsData] = await Promise.all([
        getActiveBrands(),
        getCategories(),
        filterProducts({ status: statusFilter })
      ]);
      setAllProducts(productsData);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
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
    try {
      setLoading(true);
      setError(null);
      if (currentProduct && currentProduct.productId) {
        await updateProduct(currentProduct.productId, formData as UpdateProductDto, imageFile || undefined);
      } else {
        await createProduct(formData as CreateProductDto, imageFile || undefined);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || '';

    return allProducts.filter(p => {
      if (!q) return true;
      const lowerCaseQuery = q.toLowerCase();
      return p.name?.toLowerCase().includes(lowerCaseQuery) ||
        p.brandName?.toLowerCase().includes(lowerCaseQuery) ||
        p.categoryName?.toLowerCase().includes(lowerCaseQuery);
    });
  }, [allProducts, location.search]);

  const {
    paginatedItems: paginatedProducts,
    totalPages,
    currentPage: safePage
  } = useClientPagination(filteredProducts, page, PAGE_SIZE)

  // const handleStatusChange = async (id: number) => {
  //   await confirmAction('Are you sure you want to change status of this product?', async () => {
  //     await runAsync(async () => {
  //       setError(null)
  //       await changeProductStatus(id)
  //       await fetchData()
  //     }, setError, 'Failed to change product status')
  //   })
  // };

  const handleStatusChange = async (id: number) => {
  const confirmed = await confirmAction(
    'Are you sure you want to change status of this product?'
  );

  if (!confirmed) return;

  try {
    setError(null);

    await changeProductStatus(id);

    await fetchData(); 

  } catch (err: any) {
    console.error(err);
    // toast.error(err.message || 'Failed to change product status');
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
    setIsModalOpen(true);
  };

  const openEditModal = async (product: ViewProductDto) => {
    setCurrentProduct(product);
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
      setError('Failed to load product details');
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

      <div className="flex gap-2 mb-4">
        {([
          { label: 'Tất cả', value: undefined },
          { label: 'Đang bán', value: 0 },
          { label: 'Ngừng bán', value: 1 },
          { label: 'Hết hàng', value: 2 },
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
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {!loading && !error && (
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
        onClose={() => setIsModalOpen(false)}
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
              className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
            >
              {currentProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;
