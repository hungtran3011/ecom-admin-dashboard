import React from 'react';
import { Link } from 'react-router-dom';

interface ProductFormHeaderProps {
    productId?: string;
    productName?: string;
    isEditMode: boolean;
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({ productId, productName, isEditMode }) => {
    const title = isEditMode ? `Edit Product: ${productName || ''}` : 'Create New Product';
    const cancelLink = isEditMode && productId ? `/admin/products/${productId}` : '/admin/products';

    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <Link
                to={cancelLink}
                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-colors text-sm"
            >
                Cancel
            </Link>
        </div>
    );
};

export default ProductFormHeader;