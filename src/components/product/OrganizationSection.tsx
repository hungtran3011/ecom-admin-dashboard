import React from 'react';
import { Product, Category } from '../../types/product.types';

interface OrganizationSectionProps {
    product: Partial<Product>;
    categories: Category[];
    selectedCategory: Category | null;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
    product,
    categories,
    selectedCategory,
    onCategoryChange,
    onStatusChange
}) => {
    return (
        <fieldset>
            <legend className="text-lg font-medium text-gray-900 mb-4">Organization</legend>
            <div className="space-y-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={product.category?._id || ''}
                        onChange={onCategoryChange}
                        className="input-field"
                    >
                        <option value="">Select a category...</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    {selectedCategory?.description && <p className="mt-1 text-xs text-gray-500">{selectedCategory.description}</p>}
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={product.status || 'draft'}
                        onChange={onStatusChange}
                        className="input-field"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>
        </fieldset>
    );
};

export default OrganizationSection;