import React from 'react';
import { Link } from 'react-router-dom';

type Product = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdBy: string;
};

type ProductCardProps = {
  product: Product;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <div className="mt-2">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        </div>
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">{product.description}</p>
        
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {product.category ? product.category : 'Uncategorized'}
          </span>
          <Link 
            to={`/admin/products/${product._id || 'details'}`}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};