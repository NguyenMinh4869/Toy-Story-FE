import React from 'react';
import { Edit, Power, PowerOff } from 'lucide-react';
import type { ViewStaffDto } from '../../types/StaffDTO';

interface StaffListTableProps {
  staffList: ViewStaffDto[];
  onEdit: (staff: ViewStaffDto) => void;
  onStatusChange: (id: number) => void;
}

const StaffListTable: React.FC<StaffListTableProps> = ({ staffList, onEdit, onStatusChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Staff Info</th>
            <th scope="col" className="px-6 py-3">Contact</th>
            <th scope="col" className="px-6 py-3">Warehouse</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.accountId} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="font-semibold">{staff.name}</div>
                <div className="text-xs text-gray-500">{staff.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-900">{staff.phoneNumber || 'N/A'}</div>
                <div className="text-xs text-gray-500 truncate max-w-[150px]">{staff.address || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                {staff.warehouseName || 'N/A'}
              </td>
              <td className="px-6 py-4">
                {staff.role}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => staff.accountId && onStatusChange(staff.accountId)}
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                    (staff.status?.toLowerCase() === 'active' || staff.status?.toLowerCase() === 'đang hoạt động')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {staff.status}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(staff)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button
                    onClick={() => staff.accountId && onStatusChange(staff.accountId)}
                    className={`text-xs font-medium flex items-center gap-1 ${
                      (staff.status?.toLowerCase() === 'active' || staff.status?.toLowerCase() === 'đang hoạt động')
                        ? 'text-yellow-600 hover:text-yellow-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {(staff.status?.toLowerCase() === 'active' || staff.status?.toLowerCase() === 'đang hoạt động') ? (
                      <><PowerOff size={14} /> DISABLE</>
                    ) : (
                      <><Power size={14} /> ENABLE</>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {staffList.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No staff found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffListTable;
