/**
 * Staff Promotion Management Page - READ ONLY (FR-1)
 * Staff can only view promotions, no create/update/delete
 */
import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { getPromotionsCustomerFilter } from '../../services/promotionService';
import type { ViewPromotionSummaryDto } from '../../types/PromotionDTO';
import Modal from '../../components/ui/Modal';

const StaffPromotionManagementPage: React.FC = () => {
  const [promotions, setPromotions] = useState<ViewPromotionSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<ViewPromotionSummaryDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPromotionsCustomerFilter();
      setPromotions(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const getDiscountTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Percentage';
      case 1: return 'Fixed Amount';
      default: return 'Unknown';
    }
  };

  const handleView = (promotion: ViewPromotionSummaryDto) => {
    setSelectedPromotion(promotion);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedPromotion(null);
  };

  if (loading && promotions.length === 0) {
    return <div className="text-center py-8">Loading promotions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Promotion Management</h2>
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
                <th scope="col" className="px-6 py-3">Promotion Info</th>
                <th scope="col" className="px-6 py-3">Discount</th>
                <th scope="col" className="px-6 py-3">Duration</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No promotions found
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => (
                  <tr key={promotion.promotionId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="w-10 h-10 rounded-md object-cover mr-4" 
                          src={promotion.imageUrl || 'https://via.placeholder.com/40'} 
                          alt={promotion.name || 'Promotion'} 
                        />
                        <div>
                          <div className="font-semibold">{promotion.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">
                            {promotion.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-red-600">
                        {promotion.discountType === 0 
                          ? `${promotion.discountValue}%`
                          : `${promotion.discountValue?.toLocaleString()} VND`
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {getDiscountTypeLabel(promotion.discountType || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div>From: {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : 'N/A'}</div>
                        <div>To: {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        promotion.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(promotion)}
                        className="text-emerald-600 hover:text-emerald-800"
                        title="View Promotion Details"
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

      {/* View Promotion Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Promotion Details"
      >
        {selectedPromotion && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedPromotion.imageUrl || 'https://via.placeholder.com/200'}
                alt={selectedPromotion.name}
                className="w-48 h-48 rounded-lg object-cover"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Promotion ID</label>
                <p className="mt-1 text-gray-900">{selectedPromotion.promotionId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Promotion Name</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">{selectedPromotion.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-gray-900">{selectedPromotion.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                  <p className="mt-1 text-gray-900">{getDiscountTypeLabel(selectedPromotion.discountType || 0)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                  <p className="mt-1 text-red-600 font-semibold">
                    {selectedPromotion.discountType === 0
                      ? `${selectedPromotion.discountValue}%`
                      : `${selectedPromotion.discountValue?.toLocaleString()} VND`
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-gray-900">
                    {selectedPromotion.startDate ? new Date(selectedPromotion.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-gray-900">
                    {selectedPromotion.endDate ? new Date(selectedPromotion.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedPromotion.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedPromotion.isActive ? 'Active' : 'Inactive'}
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

export default StaffPromotionManagementPage;