import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import VoucherListTable from '../../components/admin/VoucherListTable';
import Modal from '../../components/ui/Modal';
import {
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  changeVoucherStatus,
} from '../../services/voucherService';
import type {
  ViewVoucherSummaryDto,
  CreateVoucherDto,
  UpdateVoucherDto,
  DiscountType,
} from '../../types/VoucherDTO';
import Pagination from '../../components/ui/Pagination';

const PAGE_SIZE = 10;

const VoucherManagementPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<ViewVoucherSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const q = searchParams.get('q') || '';

  const filteredVouchers = useMemo(() => {
    if (!q) return vouchers;
    return vouchers.filter(v => 
        v.name?.toLowerCase().includes(q.toLowerCase()) ||
        v.code?.toLowerCase().includes(q.toLowerCase())
    );
  }, [vouchers, q]);

  const paginatedVouchers = useMemo(() => {
      const start = (page - 1) * PAGE_SIZE;
      return filteredVouchers.slice(start, start + PAGE_SIZE);
  }, [filteredVouchers, page]);

  const totalPages = Math.ceil(filteredVouchers.length / PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucherId, setCurrentVoucherId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setImagePreview(null);
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
      // Try to set image preview if there is an existing image (assume url field might exist)
      setImagePreview((details as any).imageUrl || null);
      setCurrentVoucherId(voucher.voucherId);
      setIsEditing(true);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch voucher details');
    }
  };


  const handleStatusChange = async (id: number) => {
    try {
      setError(null);
      await changeVoucherStatus(id);
      await fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-900">Quản lý Voucher</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-red-400 text-white px-4 py-2 rounded-3xl flex items-center gap-2 hover:bg-red-600 font-black"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Thêm Voucher
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
      ) : paginatedVouchers.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No vouchers found.</div>
      ) : (
        <>
          <VoucherListTable
            vouchers={paginatedVouchers}
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
        title={isEditing ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
        size="xxl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                <input
                  type="text"
                  name="Code"
                  value={formData.Code}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tên Voucher</label>
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
                  rows={2}
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
                  <label className="block text-sm font-medium text-gray-700">Số lượt sử dụng tối đa</label>
                  <input
                    type="number"
                    name="MaxUsage"
                    value={formData.MaxUsage}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số lượt dùng tối đa / khách
                  </label>
                  <input
                    type="number"
                    name="MaxUsagePerCustomer"
                    value={formData.MaxUsagePerCustomer}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                  <input
                    type="date"
                    name="ValidFrom"
                    value={formData.ValidFrom}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                  <input
                    type="date"
                    name="ValidTo"
                    value={formData.ValidTo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload section */}
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

export default VoucherManagementPage;
