/**
 * Staff Product Management Page
 * Reuses Admin Product Management logic
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProductListTable from '../../components/admin/ProductListTable';
import Modal from '../../components/ui/Modal';
import { 
  createProduct, 
  updateProduct, 
  filterProducts 
} from '../../services/productService';
import { getActiveBrands } from '../../services/brandService';
import { getCategories } from '../../services/categoryService';
import type { ViewProductDto, CreateProductDto, UpdateProductDto, GenderTarget, AgeRange } from '../../types/ProductDTO';
import type { ViewBrandDto } from '../../types/BrandDTO';
import type { ViewCategoryDto } from '../../types/CategoryDTO';

const StaffProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<ViewProductDto[]>([]);
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [categories, setCategories] = useState<ViewCategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ViewProductDto | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    Name: '',
    Description: '',
    Price: 0,
    Stock: 0,
    Origin: '',
    Material: '',
    Gender: 0 as GenderTarget,
    AgeRange: 0 as AgeRange,
    CategoryId: 0,
    BrandId: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [brandsData, categoriesData] = await Promise.all([
        getActiveBrands(),
        getCategories()
      ]);
      const q = new URLSearchParams(location.search).get('q') || '';
      const allProducts = q.trim()
        ? await filterProducts({ name: q.trim() })
        : await filterProducts({}); 
      setProducts(allProducts);
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
      [name]: name === 'Price' || name === 'Stock' || name === 'CategoryId' || name === 'BrandId' || name === 'Gender' || name === 'AgeRange' 
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
      if (currentProduct && currentProduct.productId) {
        await updateProduct(currentProduct.productId, formData as UpdateProductDto, imageFile || undefined);
      } else {
        await createProduct(formData as CreateProductDto, imageFile || undefined);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ViewProductDto) => {
    setCurrentProduct(product);
    setFormData({
      Name: product.name || '',
      Description: product.description || '',
      Price: product.price || 0,
      Stock: 0, // Stock not available in ViewProductDto
      Origin: product.origin || '',
      Material: product.material || '',
      Gender: (product.gender as unknown as GenderTarget) || 0,
      AgeRange: (product.ageRange as unknown as AgeRange) || 0,
      CategoryId: product.categoryId || 0,
      BrandId: product.brandId || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    // Delete handler placeholder
    console.log('Delete product:', productId);
  };

  const resetForm = () => {
    setCurrentProduct(null);
    setFormData({
      Name: '',
      Description: '',
      Price: 0,
      Stock: 0,
      Origin: '',
      Material: '',
      Gender: 0 as GenderTarget,
      AgeRange: 0 as AgeRange,
      CategoryId: 0,
      BrandId: 0
    });
    setImageFile(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading && products.length === 0) return <div className="text-center py-8">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={openAddModal}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ProductListTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={currentProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="Description"
              value={formData.Description || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="Price"
                value={formData.Price || 0}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="Stock"
                value={formData.Stock || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input
                type="text"
                name="Origin"
                value={formData.Origin || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input
                type="text"
                name="Material"
                value={formData.Material || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                name="BrandId"
                value={formData.BrandId || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value={0}>Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.brandId} value={brand.brandId}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="CategoryId"
                value={formData.CategoryId || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value={0}>Select Category</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="Gender"
                value={formData.Gender || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={0}>Boy</option>
                <option value={1}>Girl</option>
                <option value={2}>Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
              <select
                name="AgeRange"
                value={formData.AgeRange || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={0}>0-2 years</option>
                <option value={1}>3-5 years</option>
                <option value={2}>6-8 years</option>
                <option value={3}>9-12 years</option>
                <option value={4}>13+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : currentProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffProductManagementPage;
