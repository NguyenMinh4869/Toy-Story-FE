import React from 'react';
import { MoreVertical, Trash2, Edit } from 'lucide-react';

const mockProducts = [
  {
    id: 1,
    name: 'Classic Red Bear',
    sku: 'SKU:TOY-7721',
    image: 'https://via.placeholder.com/40',
    stock: 'Vehicles',
    category: 'Plushies',
    price: '$24.99',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Turbo Racer X1',
    sku: 'SKU:TOY-4402',
    image: 'https://via.placeholder.com/40',
    stock: '12',
    category: 'Vehicles',
    price: '$49.50',
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Smart Blocks Pro',
    sku: 'SKU:TOY-8819',
    image: 'https://via.placeholder.com/40',
    stock: '452',
    category: 'Educational',
    price: '$32.00',
    status: 'Active',
  },
];

const ProductListTable: React.FC = () => {
  return (
    <div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Toy Info</th>
            <th scope="col" className="px-6 py-3">Stock</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {mockProducts.map((product) => (
            <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="w-10 h-10 rounded-md object-cover mr-4" src={product.image} alt={product.name} />
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.sku}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">{product.category}</td>
              <td className="px-6 py-4 text-red-500 font-semibold">{product.price}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <button className="text-blue-600 hover:text-blue-900 text-xs font-medium flex items-center gap-1">
                    <Edit size={14} /> EDIT
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between pt-4">
        <span className="text-sm text-gray-700">
          Showing <span className="font-semibold">1-10</span> of <span className="font-semibold">1,284</span> products
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
            Prev
          </button>
          <button className="px-3 py-1 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListTable;
