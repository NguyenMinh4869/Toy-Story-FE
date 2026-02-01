import React from 'react';
import type { ViewVoucherSummaryDto } from '../../types/VoucherDTO';
import { Edit, Power, PowerOff } from 'lucide-react';

interface VoucherListTableProps {
  vouchers: ViewVoucherSummaryDto[];
  onEdit: (voucher: ViewVoucherSummaryDto) => void;
  onStatusChange: (id: number) => void;
}

const VoucherListTable: React.FC<VoucherListTableProps> = ({
  vouchers,
  onEdit,
  onStatusChange,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Used Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Validity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vouchers.map((voucher) => (
            <tr key={voucher.voucherId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {voucher.imageUrl && (
                    <img
                      className="h-8 w-8 rounded-full object-cover mr-3"
                      src={voucher.imageUrl}
                      alt=""
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900">{voucher.code}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {voucher.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {voucher.usedCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span>From: {voucher.validFrom ? new Date(voucher.validFrom).toLocaleDateString() : 'N/A'}</span>
                  <span>To: {voucher.validTo ? new Date(voucher.validTo).toLocaleDateString() : 'N/A'}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => voucher.voucherId && onStatusChange(voucher.voucherId)}
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    voucher.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {voucher.isActive ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEdit(voucher)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button
                    onClick={() => voucher.voucherId && onStatusChange(voucher.voucherId)}
                    className={`text-xs font-medium flex items-center gap-1 ${
                      voucher.isActive
                        ? 'text-yellow-600 hover:text-yellow-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {voucher.isActive ? (
                      <><PowerOff size={14} /> DISABLE</>
                    ) : (
                      <><Power size={14} /> ENABLE</>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherListTable;
