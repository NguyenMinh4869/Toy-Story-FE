import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import VoucherListTable from '../../components/admin/VoucherListTable';
import Modal from '../../components/ui/Modal';
import {
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  changeVoucherStatus,
} from '../../services/voucherService';
import type {
  ViewVoucherSummaryDto,
  CreateVoucherDto,
  UpdateVoucherDto,
  DiscountType,
} from '../../types/VoucherDTO';
import { confirmAction } from '../../utils/confirmAction';
import { runAsync } from '../../utils/runAsync';

const VoucherManagementPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<ViewVoucherSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucherId, setCurrentVoucherId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateVoucherDto>({
    Code: '',
    Name: '',
    Description: '',
    DiscountType: 0 as DiscountType,
    DiscountValue: 0,
    MaxUsage: 0,
    MaxUsagePerCustomer: 0,
    ValidFrom: '',
    ValidTo: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch vouchers');
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
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'DiscountType' ||
        name === 'DiscountValue' ||
        name === 'MaxUsage' ||
        name === 'MaxUsagePerCustomer'
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      Code: '',
      Name: '',
      Description: '',
      DiscountType: 0 as DiscountType,
      DiscountValue: 0,
      MaxUsage: 0,
      MaxUsagePerCustomer: 0,
      ValidFrom: '',
      ValidTo: '',
    });
    setImageFile(null);
    setIsEditing(false);
    setCurrentVoucherId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = async (voucher: ViewVoucherSummaryDto) => {
    if (!voucher.voucherId) return;
    try {
      const details = await getVoucherById(voucher.voucherId);
      setFormData({
        Code: details.code || '',
        Name: details.name || '',
        Description: details.description || '',
        DiscountType: (details.discountType as DiscountType) || 0,
        DiscountValue: details.discountValue || 0,
        MaxUsage: details.maxUsage || 0,
        MaxUsagePerCustomer: details.maxUsagePerCustomer || 0,
        ValidFrom: details.validFrom ? details.validFrom.split('T')[0] : '',
        ValidTo: details.validTo ? details.validTo.split('T')[0] : '',
      });
      setCurrentVoucherId(voucher.voucherId);
      setIsEditing(true);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch voucher details');
    }
  };

  const handleDelete = async (id: number) => {
    await confirmAction('Are you sure you want to delete this voucher?', async () => {
      await runAsync(async () => {
        await deleteVoucher(id);
        await fetchData();
      }, setError, 'Failed to delete voucher');
    });
  };

  const handleStatusChange = async (id: number) => {
    await runAsync(async () => {
      await changeVoucherStatus(id);
      await fetchData();
    }, setError, 'Failed to update status');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentVoucherId) {
        const updateData: UpdateVoucherDto = { ...formData };
        // Clean up empty dates if necessary, or let them be empty string
        await updateVoucher(currentVoucherId, updateData, imageFile || undefined);
      } else {
        await createVoucher(formData, imageFile || undefined);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to save voucher');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Voucher Management</h1>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Voucher
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
        <VoucherListTable
          vouchers={vouchers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Voucher' : 'Create Voucher'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="Code"
              value={formData.Code}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            />
          </div>

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
              <label className="block text-sm font-medium text-gray-700">Max Usage</label>
              <input
                type="number"
                name="MaxUsage"
                value={formData.MaxUsage}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Usage Per Customer
              </label>
              <input
                type="number"
                name="MaxUsagePerCustomer"
                value={formData.MaxUsagePerCustomer}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid From</label>
              <input
                type="date"
                name="ValidFrom"
                value={formData.ValidFrom}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid To</label>
              <input
                type="date"
                name="ValidTo"
                value={formData.ValidTo}
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

export default VoucherManagementPage;
