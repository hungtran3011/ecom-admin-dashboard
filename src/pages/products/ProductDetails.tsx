import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import { useUser } from '../../hooks/useUser';
import { Product } from '../../types/product.types';

type ExtendedProduct = Product & {
  createdByName: string
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );
  const { accessToken } = useUser();
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/product/${id}`, {
            "headers": {
                "cache-control": "no-cache",
            }
        });
        setProduct(response.data);
        setError(null);
        
        // Fetch category name if we only have ID
        if (response.data.category && !response.data.categoryName) {
          try {
            const categoryResponse = await axiosInstance.get(`/product/category/${response.data.category}`);
            setProduct(prev => prev ? {...prev, categoryName: categoryResponse.data.name} : null);
          } catch (err) {
            setProduct(prev => prev ? {...prev, categoryName: "None"} : null);
            console.error('Error fetching category details:', err);
          }
        }
        
        // Fetch creator name if we only have ID
        if (response.data.createdBy && !response.data.createdByName) {
          try {
            const userResponse = await axiosInstance.get(
                `/user/${response.data.createdBy}`,
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            setProduct(prev => prev ? {...prev, createdByName: userResponse.data.name} : null);
          } catch (err) {
            console.error('Error fetching user details:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    
    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [id, successMessage, accessToken]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/product/${id}`);
      navigate('/admin/products', { 
        replace: true, 
        state: { message: 'Product successfully deleted' } 
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link 
          to="/admin/products" 
          className="text-blue-500 hover:underline"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
        <p className="text-yellow-700 mb-4">Product not found</p>
        <Link 
          to="/admin/products" 
          className="text-blue-500 hover:underline"
        >
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {successMessage && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-700 mb-6">
          {successMessage}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <div className="flex space-x-3">
          <Link
            to={`/admin/products/edit/${id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-gray-800">{product.category.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p className="text-gray-800">{product.createdByName}</p>
              </div>
              {product.updatedAt && (
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-800">{new Date(product.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Pricing</h3>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>
          
          {/* Additional product metadata could go here */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Product ID</h4>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{product._id}</code>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link 
          to="/admin/products" 
          className="text-blue-500 hover:underline flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;