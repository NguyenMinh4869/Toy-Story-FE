/**
 * Staff Brand Management Page - READ ONLY (FR-1)
 * Staff can only view brands, no create/update/delete
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { filterBrands } from '../../services/brandService';
import type { ViewBrandDto } from '../../types/BrandDTO';
import Modal from '../../components/ui/Modal';

const StaffBrandManagementPage: React.FC = () => {
  const [brands, setBrands] = useState<ViewBrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<ViewBrandDto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams(location.search).get('q') || '';
      const allBrands = q.trim()
        ? await filterBrands({ name: q.trim() })
        : await filterBrands({});
      setBrands(allBrands);
    } catch (err) {
      console.error(err);
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (brand: ViewBrandDto) => {
    setSelectedBrand(brand);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedBrand(null);
  };

  if (loading && brands.length === 0) {
    return <div className="text-center py-8">Loading brands...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Brand Management</h2>
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
                <th scope="col" className="px-6 py-3">Brand Info</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No brands found
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.brandId} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="w-10 h-10 rounded-md object-cover mr-4" 
                          src={brand.imageUrl || 'https://via.placeholder.com/40'} 
                          alt={brand.name || 'Brand'} 
                        />
                        <div className="font-semibold">{brand.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        brand.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {brand.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(brand)}
                        className="text-emerald-600 hover:text-emerald-800"
                        title="View Brand Details"
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

      {/* View Brand Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Brand Details"
      >
        {selectedBrand && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={selectedBrand.imageUrl || 'https://via.placeholder.com/200'}
                alt={selectedBrand.name || 'Brand'}
                className="w-48 h-48 rounded-lg object-cover"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand ID</label>
                <p className="mt-1 text-gray-900">{selectedBrand.brandId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">{selectedBrand.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                  selectedBrand.status === 'Available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedBrand.status || 'Unknown'}
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

export default StaffBrandManagementPage;
