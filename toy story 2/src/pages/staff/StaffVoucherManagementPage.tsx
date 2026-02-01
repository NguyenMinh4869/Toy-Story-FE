/**
 * Staff Voucher Management Page - READ ONLY
 * Staff can only view vouchers
 */
import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getVouchers } from '../../services/voucherService';
import type { ViewVoucherSummaryDto } from '../../types/VoucherDTO';

const StaffVoucherManagementPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<ViewVoucherSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getVouchers();
      setVouchers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  if (loading && vouchers.length === 0) {
    return <div className="text-center py-8">Loading vouchers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Voucher Management</h2>
          <p className="text-sm text-gray-600 mt-1">📖 View Only - No editing allowed</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Code</th>
                <th scope="col" className="px-6 py-3">Voucher Info</th>
                <th scope="col" className="px-6 py-3">Discount</th>
                <th scope="col" className="px-6 py-3">Usage</th>
                <th scope="col" className="px-6 py-3">Valid Period</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No vouchers found
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr key={voucher.voucherId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-semibold text-green-600">
                      {voucher.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>
                        <div className="font-semibold">{voucher.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {voucher.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-red-600">
                        {voucher.discountType === 0 
                          ? `${voucher.discountValue}%`
                          : `${voucher.discountValue?.toLocaleString()} VND`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div>Used: {voucher.usageCount || 0} / {voucher.maxUsage || '∞'}</div>
                        <div>Per User: {voucher.maxUsagePerCustomer || '∞'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div>From: {voucher.validFrom ? new Date(voucher.validFrom).toLocaleDateString() : 'N/A'}</div>
                        <div>To: {voucher.validTo ? new Date(voucher.validTo).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        voucher.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {voucher.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-gray-400 hover:text-gray-600 cursor-not-allowed"
                        title="View Only - Editing not allowed"
                        disabled
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
    </div>
  );
};

export default StaffVoucherManagementPage;
