import React from 'react';
import { Product } from '../../types/product.types';

interface BasicInfoSectionProps {
    product: Partial<Product>; // Use Partial as product might be null initially in parent
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ product, onChange }) => {
    return (
        <fieldset>
            <legend className="text-lg font-medium text-gray-900 mb-4">Basic Information</legend>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={product.name || ''}
                        onChange={onChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                        id="sku"
                        name="sku"
                        type="text"
                        value={product.sku || ''}
                        onChange={onChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        value={product.description || ''}
                        onChange={onChange}
                        className="input-field"
                    />
                </div>
            </div>
        </fieldset>
    );
};

export default BasicInfoSection;