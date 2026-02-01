/**
 * Staff Warehouse Management Page
 * CRUD operations for warehouse products (FR-2)
 */
import React, { useEffect, useState } from 'react';
import { Edit, AlertCircle, Trash2, Plus, Search } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { 
  getWarehouseProductsWithDetails,
  updateWarehouseProduct,
  addWarehouseProduct,
  removeWarehouseProduct,
  CreateWarehouseProductDto,
  WarehouseProductDto
} from '../../services/warehouseService';
import { getStoredUserMetadata } from '../../services/authService';
import { getCurrentStaffWarehouseId } from '../../services/staffService';
import { filterProducts } from '../../services/productService';
import { filterBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';

const StaffWarehouseManagementPage: React.FC = () => {
  const [products, setProducts] = useState<WarehouseProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<WarehouseProductDto | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [newQuantity, setNewQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    initializeAndFetchData();
  }, []);

  // Auto-apply filters when any filter changes
  useEffect(() => {
    if (isAddModalOpen) {
      const debounceTimer = setTimeout(() => {
        applyFilters();
      }, 300); // Debounce for 300ms to avoid too many API calls
      
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, genderFilter, ageRangeFilter, categoryFilter, brandFilter, isAddModalOpen]);

  const initializeAndFetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize staff context
      const metadata = getStoredUserMetadata();
      if (!metadata?.accountId) {
        setError('No account ID found. Please login again.');
        return;
      }

      const staffWarehouseId = await getCurrentStaffWarehouseId(metadata.accountId);
      setWarehouseId(staffWarehouseId);

      // Fetch warehouse products with full details (brand/category)
      const warehouseProducts = await getWarehouseProductsWithDetails(staffWarehouseId);
      setProducts(warehouseProducts);
    } catch (err) {
      console.error('Failed to initialize:', err);
      setError('Failed to load warehouse data');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      if (!warehouseId) {
        setError('Warehouse ID not found');
        setProducts([]);
        return;
      }
      
      const warehouseProducts = await getWarehouseProductsWithDetails(warehouseId);
      setProducts(warehouseProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load warehouse products');
      setProducts([]); // Set empty array on error
    }
  };

  const getStockStatus = (quantity: number | undefined) => {
    const qty = quantity || 0;
    if (qty === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (qty <= 10) {
      return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    }
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const handleEdit = (product: WarehouseProductDto) => {
    setCurrentProduct(product);
    setQuantity(product.quantity || 0);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: WarehouseProductDto) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = async () => {
    try {
      // Load initial products and filter data
      const [allProducts, categoriesData, brandsData] = await Promise.all([
        filterProducts({}),
        getCategories(),
        filterBrands({ status: 'Active' })
      ]);
      
      // Filter out products already in warehouse
      const existingProductIds = products.map(p => p.productId);
      const available = allProducts.filter(p => !existingProductIds.includes(p.productId));
      setAvailableProducts(available);
      setFilteredProducts(available);
      setCategories(categoriesData);
      setBrands(brandsData);
      setSelectedProductId(0);
      setSearchTerm('');
      setGenderFilter('');
      setAgeRangeFilter('');
      setCategoryFilter('');
      setBrandFilter('');
      setIsAddModalOpen(true);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load available products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct?.productWarehouseId) {
      setError('Invalid product warehouse ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // API expects just the quantity number, not an object
      await updateWarehouseProduct(currentProduct.productWarehouseId, quantity);
      setIsEditModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to update product:', err);
      setError(err.message || 'Failed to update product quantity');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || newQuantity <= 0) {
      setError('Please select a product and enter a valid quantity');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const addData: CreateWarehouseProductDto = {
        productId: selectedProductId,
        quantity: newQuantity
      };

      await addWarehouseProduct(addData);
      setIsAddModalOpen(false);
      setNewQuantity(1);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to add product:', err);
      setError(err.message || 'Failed to add product to warehouse');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentProduct?.productWarehouseId) {
      setError('Invalid product warehouse ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await removeWarehouseProduct(currentProduct.productWarehouseId);
      setIsDeleteModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error('Failed to remove product:', err);
      setError(err.message || 'Failed to remove product from warehouse');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentProduct(null);
    setQuantity(0);
    setNewQuantity(1);
    setSelectedProductId(0);
    setSearchTerm('');
    setGenderFilter('');
    setAgeRangeFilter('');
    setCategoryFilter('');
    setBrandFilter('');
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProductId(productId);
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.name = searchTerm;
      if (genderFilter) params.genderTarget = genderFilter;
      if (ageRangeFilter) params.ageRange = ageRangeFilter;
      if (categoryFilter) params.categoryId = parseInt(categoryFilter);
      if (brandFilter) params.brandId = parseInt(brandFilter);
      
      const allProducts = await filterProducts(params);
      const existingProductIds = products.map(p => p.productId);
      const available = allProducts.filter(p => !existingProductIds.includes(p.productId));
      setAvailableProducts(available);
      setFilteredProducts(available);
    } catch (err) {
      console.error('Failed to apply filters:', err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setGenderFilter('');
    setAgeRangeFilter('');
    setCategoryFilter('');
    setBrandFilter('');
    applyFilters();
  };

  if (loading && (!products || products.length === 0)) {
    return <div className="text-center py-8">Loading warehouse products...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Warehouse Product Management</h2>
          {warehouseId && (
            <p className="text-xs md:text-sm text-gray-600 mt-1">Managing Warehouse ID: {warehouseId}</p>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-3 md:px-6 py-3 min-w-[200px]">Product Info</th>
                <th scope="col" className="px-3 md:px-6 py-3 min-w-[120px]">Brand / Category</th>
                <th scope="col" className="px-3 md:px-6 py-3 min-w-[100px]">Price</th>
                <th scope="col" className="px-3 md:px-6 py-3 w-24">Quantity</th>
                <th scope="col" className="px-3 md:px-6 py-3 w-28">Status</th>
                <th scope="col" className="px-3 md:px-6 py-3 w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found in warehouse
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const status = getStockStatus(product.quantity);
                  return (
                    <tr key={product.productWarehouseId} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2 md:gap-4">
                          <img 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-md object-cover flex-shrink-0" 
                            src={product.imageUrl || 'https://via.placeholder.com/40'} 
                            alt={product.productName || 'Product'} 
                          />
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{product.productName || 'N/A'}</div>
                            <div className="text-xs text-gray-500">ID: {product.productId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <div className="text-gray-900 text-xs md:text-sm">{product.brandName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{product.categoryName || 'N/A'}</div>
                      </td>
                      <td className="px-3 md:px-6 py-4 text-emerald-600 font-semibold whitespace-nowrap">
                        {product.price?.toLocaleString()} VND
                      </td>
                      <td className="px-3 md:px-6 py-4 text-center">
                        <span className="font-semibold">{product.quantity || 0}</span>
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-emerald-600 hover:text-emerald-800 p-1"
                            title="Edit Quantity"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModal}
        title="Update Product Quantity"
      >
        {currentProduct && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">{currentProduct.productName || 'Product'}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Product Warehouse ID: {currentProduct.productWarehouseId}
              </p>
              <p className="text-sm text-gray-600">
                Current Quantity: {currentProduct.quantity || 0}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Quantity
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Status: {quantity === 0 ? '🔴 Out of Stock' : quantity <= 10 ? '🟠 Low Stock' : '🟢 Active'}
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Quantity'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        title="Add Product to Warehouse"
      >
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Gender Target</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="Boy">Boy</option>
                <option value="Girl">Girl</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Age Range</label>
              <select
                value={ageRangeFilter}
                onChange={(e) => setAgeRangeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Ages</option>
                <option value="ZeroToSixMonths">0-6 Months</option>
                <option value="SixToTwelveMonths">6-12 Months</option>
                <option value="OneToThreeYears">1-3 Years</option>
                <option value="ThreeToSixYears">3-6 Years</option>
                <option value="AboveSixYears">Above 6 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.brandId} value={brand.brandId}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>

          {/* Product List */}
          <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {availableProducts.length === 0 ? 'No products available to add' : 'No products match your search'}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => handleSelectProduct(product.productId)}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedProductId === product.productId
                      ? 'bg-emerald-50 border-2 border-emerald-500'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {/* Product Image */}
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/60'}
                    alt={product.name}
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {product.brandName || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {product.categoryName || 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600 mt-1">
                      {product.price?.toLocaleString()} VND
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  {selectedProductId === product.productId && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quantity Input */}
          {selectedProductId > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Quantity
              </label>
              <input
                type="number"
                min="1"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit}
              disabled={loading || selectedProductId === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        title="Remove Product"
      >
        {currentProduct && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-gray-900">
                Are you sure you want to remove <strong>{currentProduct.productName}</strong> from this warehouse?
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone. The product will be removed from inventory.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove Product'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffWarehouseManagementPage;
