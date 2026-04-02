/**
 * Staff Brand Management Page - READ ONLY (FR-1)
 * Staff can only view brands, no create/update/delete
 */
import React, { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { filterBrands } from '../../services/brandService';
import type { ViewBrandDto } from '../../types/BrandDTO';
import type { ViewProductDto } from '../../types/ProductDTO';
import { filterProducts } from '../../services/productService';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useClientPagination } from '../../hooks/useClientPagination';

// ── Status helpers ──────────────────────────────────────────────────────────
// Backend sends Vietnamese display strings via EnumHelper.GetDisplayName().
// Label is passed through as-is so the backend stays the single source of truth.
function getBrandStatusBadge(status?: string | null) {
  const className = status === 'Đang hoạt động'
    ? 'bg-green-100 text-green-800'
    : 'bg-orange-100 text-orange-800';
  return { label: status ?? '—', className };
}

function getProductStatusBadge(status?: string | null) {
  let className = 'bg-orange-100 text-orange-800';
  if (status === 'Đang bán') className = 'bg-green-100 text-green-800';
  else if (status === 'Hết hàng') className = 'bg-red-100 text-red-800';
  return { label: status ?? '—', className };
}

const PAGE_SIZE = 5;

const StaffBrandManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brands' | 'products'>('brands');
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [products, setProducts] = useState<ViewProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<ViewBrandDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [brandPage, setBrandPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [brandStatusFilter, setBrandStatusFilter] = useState<'Active' | 'Inactive' | null>(null);
  const [productStatusFilter, setProductStatusFilter] = useState<0 | 1 | 2 | null>(null);

  const {
    paginatedItems: paginatedBrands,
    totalPages: brandTotalPages,
    currentPage: safeBrandPage
  } = useClientPagination(brands, brandPage, PAGE_SIZE);
  const {
    paginatedItems: paginatedProducts,
    totalPages: productTotalPages,
    currentPage: safeProductPage
  } = useClientPagination(products, productPage, PAGE_SIZE);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, brandStatusFilter, productStatusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = debouncedSearch.trim();
      const [allBrands, allProducts] = await Promise.all([
        filterBrands({
          ...(query ? { name: query } : {}),
          ...(brandStatusFilter !== null ? { status: brandStatusFilter } : {})
        }),
        filterProducts({
          ...(query ? { searchTerm: query } : {}),
          ...(productStatusFilter !== null ? { status: productStatusFilter } : {})
        })
      ]);
      setBrands(allBrands);
      setProducts(allProducts);
      setBrandPage(1);
      setProductPage(1);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (brand: ViewBrandDto) => {
    setSelectedBrand(brand);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedBrand(null);
  };

  if (loading && brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Đang tải thương hiệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thương hiệu & sản phẩm</h2>
          <p className="text-sm text-gray-600 mt-1">Chế độ quan sát - Không thể chỉnh sửa</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm thương hiệu hoặc sản phẩm..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'brands' | 'products')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brands">Thương hiệu</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
          {/* Brand Status Filter */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {([
              { label: 'Tất cả', value: null },
              { label: 'Đang hoạt động', value: 'Active' },
              { label: 'Ngừng hoạt động', value: 'Inactive' },
            ] as { label: string; value: 'Active' | 'Inactive' | null }[]).map((tab) => (
              <button
                key={String(tab.value)}
                onClick={() => { setBrandStatusFilter(tab.value); setBrandPage(1); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  brandStatusFilter === tab.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Thông tin</th>
                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                    <th scope="col" className="px-6 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBrands.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No brands found
                      </td>
                    </tr>
                  ) : (
                    paginatedBrands.map((brand) => (
                      <tr key={brand.brandId} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="w-10 h-10 rounded-md object-cover mr-4"
                              src={brand.imageUrl || 'https://via.placeholder.com/40'}
                              alt={brand.name || 'Brand'}
                            />
                            <div className="font-semibold">{brand.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            const badge = getBrandStatusBadge(brand.status);
                            return (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.className}`}>
                                {badge.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleView(brand)}
                            className="text-emerald-600 hover:text-emerald-800"
                            title="View Brand Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={safeBrandPage}
            totalPages={brandTotalPages}
            onPageChange={setBrandPage}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {/* Product Status Filter */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {([
              { label: 'Tất cả', value: null },
              { label: 'Đang bán', value: 0 },
              { label: 'Ngừng bán', value: 1 },
              { label: 'Hết hàng', value: 2 },
            ] as { label: string; value: 0 | 1 | 2 | null }[]).map((tab) => (
              <button
                key={String(tab.value)}
                onClick={() => { setProductStatusFilter(tab.value); setProductPage(1); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  productStatusFilter === tab.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Sản phẩm</th>
                    <th scope="col" className="px-6 py-3">Danh mục</th>
                    <th scope="col" className="px-6 py-3">Thương hiệu</th>
                    <th scope="col" className="px-6 py-3">Giá</th>
                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.productId} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img
                              className="w-10 h-10 rounded-md object-cover"
                              src={product.imageUrl || 'https://via.placeholder.com/40'}
                              alt={product.name || 'Product'}
                            />
                            <span className="font-semibold">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{product.categoryName || '-'}</td>
                        <td className="px-6 py-4">{product.brandName || '-'}</td>
                        <td className="px-6 py-4">{(product.price || 0).toLocaleString('vi-VN')} VND</td>
                        <td className="px-6 py-4">
                          {(() => {
                            const badge = getProductStatusBadge(product.status);
                            return (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.className}`}>
                                {badge.label}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={safeProductPage}
            totalPages={productTotalPages}
            onPageChange={setProductPage}
          />
        </TabsContent>
      </Tabs>

      {/* View Brand Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Thông tin thương hiệu"
      >
        {selectedBrand && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedBrand.imageUrl || 'https://via.placeholder.com/200'}
                alt={selectedBrand.name || 'Brand'}
                className="w-48 h-48 rounded-lg object-cover"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <p className="mt-1 text-gray-900">{selectedBrand.brandId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên thương hiệu</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">{selectedBrand.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                {(() => {
                  const badge = getBrandStatusBadge(selectedBrand.status);
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

export default StaffBrandManagementPage;
