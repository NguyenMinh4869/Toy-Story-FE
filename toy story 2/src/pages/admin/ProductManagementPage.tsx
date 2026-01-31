import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

const ProductManagementPage: React.FC = () => {
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

  const handleStatusChange = async (id: number) => {
    await confirmAction('Are you sure you want to change status of this product?', async () => {
      await runAsync(async () => {
        setError(null)
        await changeProductStatus(id)
        await fetchData()
      }, setError, 'Failed to change product status')
    })
  };

  const openCreateModal = () => {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Product Management</h1>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {!loading && !error && (
        <ProductListTable 
          products={products} 
          onEdit={openEditModal} 
          onDelete={handleStatusChange} 
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="Stock"
                value={formData.Stock}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                disabled={!!currentProduct}
              />
              {currentProduct && (
                <p className="mt-1 text-xs text-gray-500">Stock editing is disabled (no stock field in product list/detail DTO)</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value={0}>Select Category</option>
                {categories.map(c => (
                  <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <select
                name="BrandId"
                value={formData.BrandId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value={0}>Select Brand</option>
                {brands.map(b => (
                  <option key={b.brandId} value={b.brandId}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Origin</label>
              <input
                type="text"
                name="Origin"
                value={formData.Origin}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <input
                type="text"
                name="Material"
                value={formData.Material}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value={0}>Boy</option>
                <option value={1}>Girl</option>
                <option value={2}>Unisex</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Age Range</label>
             <select
                name="AgeRange"
                value={formData.AgeRange}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value={0}>0-6 Months</option>
                <option value={1}>6-12 Months</option>
                <option value={2}>1-3 Years</option>
                <option value={3}>3-6 Years</option>
                <option value={4}>Above 6 Years</option>
              </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {currentProduct?.imageUrl && !imageFile && (
               <div className="mt-2">
                 <img src={currentProduct.imageUrl} alt="Current" className="h-20 w-20 object-cover rounded" />
               </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {currentProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;
