import React from 'react';
import { Product } from '../../types/product.types';

interface PricingInventorySectionProps {
    product: Partial<Product>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingInventorySection: React.FC<PricingInventorySectionProps> = ({ product, onChange }) => {
    return (
        <fieldset>
            <legend className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={product.price ?? ''}
                        onChange={onChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={product.stock ?? ''}
                        onChange={onChange}
                        className="input-field"
                    />
                </div>
            </div>
        </fieldset>
    );
};

export default PricingInventorySection;