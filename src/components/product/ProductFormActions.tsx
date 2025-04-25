import React from 'react';

interface ProductFormActionsProps {
    isSaving: boolean;
    isLoading: boolean;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({ isSaving, isLoading }) => {
    return (
        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
            <button
                type="submit"
                disabled={isSaving || isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default ProductFormActions;