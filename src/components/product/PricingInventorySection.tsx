import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product.types';

interface PricingInventorySectionProps {
    product: Partial<Product>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PricingInventorySection: React.FC<PricingInventorySectionProps> = ({ product, onChange }) => {
    // State for formatted price display
    const [formattedPrice, setFormattedPrice] = useState<string>(
        product.price ? product.price.toLocaleString('vi-VN') : ''
    );

    // Update formatted price when product price changes
    useEffect(() => {
        if (product.price !== undefined) {
            setFormattedPrice(product.price.toLocaleString('vi-VN'));
        } else {
            setFormattedPrice('');
        }
    }, [product.price]);

    // Handle price input with formatting
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-numeric characters
        const rawValue = e.target.value.replace(/[^\d]/g, '');
        
        // Update the formatted display
        if (rawValue) {
            setFormattedPrice(parseInt(rawValue).toLocaleString('vi-VN'));
        } else {
            setFormattedPrice('');
        }
        
        // Create a synthetic event with the numeric value for the parent component
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                name: 'price',
                value: rawValue ? parseInt(rawValue) : ''
            }
        };
        
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <fieldset>
            <legend className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₫) *</label>
                    <div className="relative">
                        {/* Hidden input for form submission */}
                        <input 
                            type="hidden" 
                            name="price" 
                            value={product.price || ''} 
                        />
                        
                        {/* Visible formatted input */}
                        <input
                            id="price"
                            type="text"
                            inputMode="numeric"
                            required
                            value={formattedPrice}
                            onChange={handlePriceChange}
                            className="input-field pr-8"
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Enter amount in Vietnamese Dong (VND)</p>
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
                        placeholder="0"
                    />
                </div>
            </div>
        </fieldset>
    );
};

export default PricingInventorySection;