import React from 'react';
import { CategoryField } from '../../types/product.types';

interface CategoryFieldFormProps {
    field: CategoryField;
    error?: string;
    onChange: (field: CategoryField) => void;
    onRemove: () => void;
    onDuplicate?: () => void;
    isDragging?: boolean;
}

const CategoryFieldForm: React.FC<CategoryFieldFormProps> = ({ 
    field, 
    error, 
    onChange, 
    onRemove,
    onDuplicate,
    isDragging = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            onChange({ ...field, [name]: checked });
            return;
        }
        
        onChange({ ...field, [name]: value });
    };

    return (
        <div className={`p-4 border ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded-md ${isDragging ? 'opacity-70' : ''}`}>
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <div className="cursor-move px-1 text-gray-400" title="Drag to reorder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </div>
                    <h3 className="font-medium text-gray-800">Field Configuration</h3>
                </div>
                <div className="flex space-x-2">
                    {onDuplicate && (
                        <button
                            type="button"
                            onClick={onDuplicate}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="Duplicate field"
                        >
                            Copy
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-red-600 hover:text-red-800 text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm error-message">
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor={`field-name-${field._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Field Name*
                    </label>
                    <input
                        id={`field-name-${field._id}`}
                        name="name"
                        type="text"
                        value={field.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Color, Size, Material"
                    />
                </div>
                
                <div>
                    <label htmlFor={`field-type-${field._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Field Type*
                    </label>
                    <select
                        id={`field-type-${field._id}`}
                        name="type"
                        value={field.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="String">Text</option>
                        <option value="Number">Number</option>
                        <option value="Boolean">Yes/No</option>
                        <option value="Date">Date</option>
                        <option value="Select">Dropdown</option>
                    </select>
                </div>
                
                <div className="flex items-center">
                    <input
                        id={`field-required-${field._id}`}
                        name="required"
                        type="checkbox"
                        checked={field.required}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`field-required-${field._id}`} className="ml-2 block text-sm text-gray-700">
                        Required Field
                    </label>
                </div>
            </div>
        </div>
    );
};

export default CategoryFieldForm;