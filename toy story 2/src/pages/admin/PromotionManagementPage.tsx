import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import PromotionListTable from '../../components/admin/PromotionListTable';
import Modal from '../../components/ui/Modal';
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
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
import { confirmAction } from '../../utils/confirmAction';
import { runAsync } from '../../utils/runAsync';
import type { ViewBrandDto } from '../../types/BrandDTO';
import type { ViewCategoryDto } from '../../types/CategoryDTO';
import type { ViewProductDto } from '../../types/ProductDTO';

const PromotionManagementPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionSummaryDto[]>([]);
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [categories, setCategories] = useState<ViewCategoryDto[]>([]);
  const [products, setProducts] = useState<ViewProductDto[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromotionId, setCurrentPromotionId] = useState<number | null>(null);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [promotionsData, brandsData, categoriesData, productsData] = await Promise.all([
        getPromotions(),
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
  }, []);

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
      setImageFile(e.target.files[0]);
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
      setCurrentPromotionId(promotion.promotionId);
      setIsEditing(true);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch promotion details');
    }
  };

  const handleDelete = async (id: number) => {
    await confirmAction('Are you sure you want to delete this promotion?', async () => {
      await runAsync(async () => {
        await deletePromotion(id);
        await fetchData();
      }, setError, 'Failed to delete promotion');
    });
  };

  const handleStatusChange = async (id: number) => {
    await runAsync(async () => {
      await changePromotionStatus(id);
      await fetchData();
    }, setError, 'Failed to update status');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Promotion Management</h1>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Promotion
        </button>
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
      ) : (
        <PromotionListTable
          promotions={promotions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Promotion' : 'Create Promotion'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <select
                name="DiscountType"
                value={formData.DiscountType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value={0}>Percentage</option>
                <option value={1}>Fixed Amount</option>
                <option value={2}>Free Shipping</option>
                <option value={3}>Buy X Get Y</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Value</label>
              <input
                type="number"
                name="DiscountValue"
                value={formData.DiscountValue}
                onChange={handleInputChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Quantity</label>
              <input
                type="number"
                name="MinimumQuantity"
                value={formData.MinimumQuantity}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Amount</label>
              <input
                type="number"
                name="MinimumAmount"
                value={formData.MinimumAmount}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <select
                name="BrandId"
                value={formData.BrandId || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="">None</option>
                {brands.map((brand) => (
                  <option key={brand.brandId} value={brand.brandId}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="CategoryId"
                value={formData.CategoryId || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                name="ProductId"
                value={formData.ProductId || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="">None</option>
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
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="StartDate"
                value={formData.StartDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="EndDate"
                value={formData.EndDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PromotionManagementPage;
