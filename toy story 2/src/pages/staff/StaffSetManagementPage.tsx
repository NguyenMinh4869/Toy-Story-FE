/**
 * Staff Set Management Page - READ ONLY (FR-1)
 * Staff can only view sets, no create/update/delete
 */
import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getSetsCustomerFilter } from '../../services/setService';
import type { ViewSetDto } from '../../types/SetDTO';
import Modal from '../../components/ui/Modal';

const StaffSetManagementPage: React.FC = () => {
  const [sets, setSets] = useState<ViewSetDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<ViewSetDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSetsCustomerFilter();
      setSets(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load sets');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (set: ViewSetDto) => {
    setSelectedSet(set);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedSet(null);
  };

  if (loading && sets.length === 0) {
    return <div className="text-center py-8">Loading sets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Set Management</h2>
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
                <th scope="col" className="px-6 py-3">Set Info</th>
                <th scope="col" className="px-6 py-3">Discount</th>
                <th scope="col" className="px-6 py-3">Price Info</th>
                <th scope="col" className="px-6 py-3">Items</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No sets found
                  </td>
                </tr>
              ) : (
                sets.map((set) => (
                  <tr key={set.setId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="w-10 h-10 rounded-md object-cover mr-4" 
                          src={set.imageUrl || 'https://via.placeholder.com/40'} 
                          alt={set.name || 'Set'} 
                        />
                        <div>
                          <div className="font-semibold">{set.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {set.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-red-600 font-semibold">
                      {set.discountPercent || 0}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-semibold">
                        {set.price?.toLocaleString()} VND
                      </div>
                      {set.savings && (
                        <div className="text-xs text-green-600">
                          Save {set.savings.toLocaleString()} VND
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{set.totalItems || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        set.status === 1 
                          ? 'bg-green-100 text-green-800' 
                          : set.status === 0
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {set.status === 1 ? 'Available' : set.status === 0 ? 'Inactive' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(set)}
                        className="text-emerald-600 hover:text-emerald-800"
                        title="View Set Details"
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

      {/* View Set Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Set Details"
      >
        {selectedSet && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedSet.imageUrl || 'https://via.placeholder.com/200'}
                alt={selectedSet.name || 'Set'}
                className="w-48 h-48 rounded-lg object-cover"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Set ID</label>
                <p className="mt-1 text-gray-900">{selectedSet.setId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Set Name</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">{selectedSet.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-gray-900">{selectedSet.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount</label>
                  <p className="mt-1 text-red-600 font-semibold">{selectedSet.discountPercent || 0}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Items</label>
                  <p className="mt-1 text-gray-900 font-semibold">{selectedSet.totalItems || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="mt-1 text-emerald-600 font-semibold">{selectedSet.price?.toLocaleString()} VND</p>
                </div>
                {selectedSet.savings && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Savings</label>
                    <p className="mt-1 text-green-600 font-semibold">{selectedSet.savings.toLocaleString()} VND</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedSet.status === 1
                    ? 'bg-green-100 text-green-800'
                    : selectedSet.status === 0
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedSet.status === 1 ? 'Available' : selectedSet.status === 0 ? 'Inactive' : 'Unavailable'}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffSetManagementPage;