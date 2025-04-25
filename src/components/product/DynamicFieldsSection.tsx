import React from 'react';
import { Category, FieldValues } from '../../types/product.types';

interface DynamicFieldsSectionProps {
    selectedCategory: Category | null;
    dynamicFieldValues: FieldValues[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DynamicFieldsSection: React.FC<DynamicFieldsSectionProps> = ({
    selectedCategory,
    dynamicFieldValues,
    onChange
}) => {
    if (!selectedCategory || selectedCategory.fields.length === 0) {
        return null;
    }

    return (
        <fieldset className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <legend className="text-base font-medium text-gray-800 mb-3">
                {selectedCategory.name} Specifications
            </legend>
            <div className="space-y-4">
                {selectedCategory.fields.map((categoryField) => {
                    // Use field._id as it's defined in the Category type
                    const currentFieldValue = Array.isArray(dynamicFieldValues)
                        ? dynamicFieldValues.find(df => df.name === categoryField.name)?.value || ''
                        : '';
                    
                    // Use field._id for unique input identifiers
                    const inputId = `dynamic-${categoryField._id}`;

                    return (
                        <div key={categoryField._id}>
                            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                                {categoryField.name} {categoryField.required ? '*' : ''}
                            </label>
                            {categoryField.type === 'String' && (
                                <input
                                    id={inputId}
                                    type="text"
                                    name={categoryField.name} // Keep using name for data association
                                    value={currentFieldValue}
                                    onChange={onChange}
                                    required={categoryField.required}
                                    className="input-field w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                            {categoryField.type === 'Number' && (
                                <input
                                    id={inputId}
                                    type="number"
                                    name={categoryField.name}
                                    value={currentFieldValue}
                                    onChange={onChange}
                                    required={categoryField.required}
                                    className="input-field w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                            {!['String', 'Number'].includes(categoryField.type) && (
                                <p className="text-xs text-red-500">Unsupported field type: {categoryField.type}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </fieldset>
    );
};

export default DynamicFieldsSection;