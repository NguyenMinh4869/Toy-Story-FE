import React from 'react';
import { Edit, Power, PowerOff } from 'lucide-react';
import type { ViewProductDto } from '../../types/ProductDTO';

interface ProductListTableProps {
  products: ViewProductDto[];
  onEdit: (product: ViewProductDto) => void;
  onStatusChange: (id: number) => void;
}

const ProductListTable: React.FC<ProductListTableProps> = ({ products, onEdit, onStatusChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Product Info</th>
            <th scope="col" className="px-6 py-3">Brand / Category</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Discount</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center">
                  <img 
                    className="w-10 h-10 rounded-md object-cover mr-4" 
                    src={product.imageUrl || '/favicon.ico'} 
                    alt={product.name || 'Product'} 
                  />
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-900">{product.brandName || 'N/A'}</div>
                <div className="text-xs text-gray-500">{product.categoryName || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 text-red-500 font-semibold">
                {product.price?.toLocaleString()} VND
              </td>
              <td className="px-6 py-4 text-green-600">
                -
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    (product.status?.toLowerCase() === 'active' || product.status?.toLowerCase() === 'đang bán')
                      ? 'bg-green-100 text-green-800'
                      : (product.status?.toLowerCase() === 'outofstock' || product.status?.toLowerCase() === 'hết hàng' || product.status?.toLowerCase() === 'inactive')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1"
                  >
                    <Edit size={14} /> EDIT
                  </button>
                  <button
                    onClick={() => product.productId && onStatusChange(product.productId)}
                    disabled={product.status?.toLowerCase() === 'outofstock' || product.status?.toLowerCase() === 'hết hàng'}
                    className={`text-xs font-medium flex items-center gap-1 ${
                      (product.status?.toLowerCase() === 'active' || product.status?.toLowerCase() === 'đang bán')
                        ? 'text-yellow-600 hover:text-yellow-900'
                        : 'text-green-600 hover:text-green-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {(product.status?.toLowerCase() === 'active' || product.status?.toLowerCase() === 'đang bán') ? (
                      <><PowerOff size={14} /> DISABLE</>
                    ) : (
                      <><Power size={14} /> ENABLE</>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListTable;
