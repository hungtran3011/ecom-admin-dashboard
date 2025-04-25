import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axios';
import { useUser } from '../hooks/useUser';
import { Category, CategoryField } from '../types/product.types';
import CategoryFieldForm from '../components/category/CategoryFieldForm';

type CategoryFormMode = 'create' | 'edit';

const CategoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const mode: CategoryFormMode = id ? 'edit' : 'create';
    const navigate = useNavigate();
    const { accessToken } = useUser();
    const initialLoadComplete = useRef(false);

    const [category, setCategory] = useState<Category>({
        _id: '',
        name: '',
        description: '',
        fields: [],
        createdBy: ''
    });
    const [initialCategory, setInitialCategory] = useState<string>('');
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(mode === 'edit');
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [draggedFieldIndex, setDraggedFieldIndex] = useState<number | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchCategory = async () => {
                try {
                    setLoading(true);
                    const response = await axiosInstance.get(`/product/category/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Cache-Control': 'no-cache'
                        }
                    });
                    
                    const categoryData = response.data;
                    setCategory(categoryData);
                    setInitialCategory(JSON.stringify(categoryData));
                    initialLoadComplete.current = true;
                } catch (err) {
                    console.error('Failed to fetch category:', err);
                    setError('Failed to load category data. Please try again.');
                } finally {
                    setLoading(false);
                }
            };
            
            fetchCategory();
        } else {
            initialLoadComplete.current = true;
        }
    }, [id, mode, accessToken]);

    useEffect(() => {
        if (!initialLoadComplete.current) return;
        
        if (initialCategory) {
            const currentCategory = JSON.stringify(category);
            setHasChanges(initialCategory !== currentCategory);
        } else if (category.name || category.fields.length > 0) {
            setHasChanges(true);
        }
    }, [category, initialCategory]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategory(prev => ({ ...prev, [name]: value }));
        
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleAddField = () => {
        if (category.fields.length >= 20) {
            setError('Maximum of 20 fields allowed per category');
            return;
        }
        
        const newField: CategoryField = {
            _id: `temp-${Date.now()}`,
            name: '',
            type: 'String',
            required: false
        };
        
        setCategory(prev => ({
            ...prev,
            fields: [...prev.fields, newField]
        }));
    };

    const handleDuplicateField = (index: number) => {
        const fieldToDuplicate = category.fields[index];
        
        if (!fieldToDuplicate) return;
        
        const duplicatedField: CategoryField = {
            ...fieldToDuplicate,
            _id: `temp-${Date.now()}`,
            name: `${fieldToDuplicate.name} (copy)`
        };
        
        setCategory(prev => {
            const newFields = [...prev.fields];
            newFields.splice(index + 1, 0, duplicatedField);
            return { ...prev, fields: newFields };
        });
    };

    const handleFieldChange = (index: number, updatedField: CategoryField) => {
        setCategory(prev => {
            const newFields = [...prev.fields];
            newFields[index] = updatedField;
            return { ...prev, fields: newFields };
        });
        
        setValidationErrors(prev => {
            const updated = { ...prev };
            delete updated[`field-${index}`];
            return updated;
        });
    };

    const handleRemoveField = (index: number) => {
        setCategory(prev => {
            const newFields = [...prev.fields];
            newFields.splice(index, 1);
            return { ...prev, fields: newFields };
        });
    };
    
    const handleDragStart = (index: number) => {
        setDraggedFieldIndex(index);
    };
    
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedFieldIndex === null || draggedFieldIndex === index) return;
        
        setCategory(prev => {
            const newFields = [...prev.fields];
            const draggedItem = newFields[draggedFieldIndex];
            
            newFields.splice(draggedFieldIndex, 1);
            newFields.splice(index, 0, draggedItem);
            
            setDraggedFieldIndex(index);
            
            return { ...prev, fields: newFields };
        });
    };
    
    const handleDragEnd = () => {
        setDraggedFieldIndex(null);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!category.name.trim()) {
            errors.name = 'Category name is required';
        }
        
        category.fields.forEach((field, index) => {
            if (!field.name.trim()) {
                errors[`field-${index}`] = 'Field name is required';
            }
        });
        
        const fieldNames = category.fields.map(f => f.name.trim().toLowerCase());
        const uniqueNames = new Set(fieldNames);
        
        if (uniqueNames.size !== fieldNames.length) {
            const duplicates = fieldNames.filter(
                (name, index) => fieldNames.indexOf(name) !== index
            );
            
            category.fields.forEach((field, index) => {
                if (duplicates.includes(field.name.trim().toLowerCase())) {
                    errors[`field-${index}`] = 'Field name must be unique';
                }
            });
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setError('Please fix the validation errors before submitting.');
            document.querySelector('.error-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        setSaving(true);
        setError(null);
        
        try {
            const fieldsForSubmission = category.fields.map(({ _id, ...rest }) => {
                return _id.startsWith('temp-') ? rest : { _id, ...rest };
            });
            
            let response;
            
            if (mode === 'create') {
                response = await axiosInstance.post('/product/category', 
                    { ...category, fields: fieldsForSubmission },
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
                setSuccess('Category created successfully!');
            } else {
                response = await axiosInstance.put(`/product/category/${id}`, 
                    { ...category, fields: fieldsForSubmission },
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );
                setSuccess('Category updated successfully!');
            }
            
            const updatedCategory = response.data;
            setCategory(updatedCategory);
            setInitialCategory(JSON.stringify(updatedCategory));
            setHasChanges(false);
            
            setTimeout(() => {
                navigate('/admin/categories', { 
                    state: { message: mode === 'create' ? 'Category created successfully!' : 'Category updated successfully!' }
                });
            }, 1500);
        } catch (err) {
            console.error('Failed to save category:', err);
            setError('Failed to save category. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
        navigate('/admin/categories');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {mode === 'create' ? 'Create Category' : `Edit Category: ${category.name}`}
                </h1>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
                    {success}
                </div>
            )}
            
            {hasChanges && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-700 text-sm">
                    You have unsaved changes
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="space-y-6 mb-8">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name*
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={category.name}
                                    onChange={handleInputChange}
                                    required
                                    className={`w-full border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {validationErrors.name && (
                                    <p className="mt-1 text-sm text-red-600 error-message">{validationErrors.name}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={category.description || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Provide a description for this category (optional)"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Custom Fields</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddField}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 text-sm transition-colors"
                                >
                                    Add Field
                                </button>
                                {category.fields.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to sort fields alphabetically?')) {
                                                setCategory(prev => ({
                                                    ...prev,
                                                    fields: [...prev.fields].sort((a, b) => a.name.localeCompare(b.name))
                                                }));
                                            }
                                        }}
                                        className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 text-sm transition-colors"
                                    >
                                        Sort A-Z
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {category.fields.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
                                    <p className="text-gray-500">No custom fields defined for this category.</p>
                                    <button
                                        type="button"
                                        onClick={handleAddField}
                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add Your First Field
                                    </button>
                                </div>
                            ) : (
                                category.fields.map((field, index) => (
                                    <div 
                                        key={field._id || index}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`${draggedFieldIndex === index ? 'border-2 border-blue-500' : ''}`}
                                    >
                                        <CategoryFieldForm
                                            field={field}
                                            // error={validationErrors[`field-${index}`]}
                                            onChange={updatedField => handleFieldChange(index, updatedField)}
                                            onRemove={() => handleRemoveField(index)}
                                            onDuplicate={() => handleDuplicateField(index)}
                                            isDragging={draggedFieldIndex === index}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
                    <div>
                        <p className="text-xs text-gray-500">
                            {category.fields.length} field{category.fields.length !== 1 ? 's' : ''} defined
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Update Category'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;