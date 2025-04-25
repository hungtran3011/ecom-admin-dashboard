import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../services/axios';
import { useUser } from '../../hooks/useUser';
import { Product, Category, FieldValues } from '../../types/product.types';
import ProductFormHeader from '../../components/product/ProductFormHeader';
import BasicInfoSection from '../../components/product/BasicInfoSection';
import PricingInventorySection from '../../components/product/PricingInventorySection';
import OrganizationSection from '../../components/product/OrganizationSection';
import DynamicFieldsSection from '../../components/product/DynamicFieldsSection';
import ProductFormActions from '../../components/product/ProductFormActions';

// Use the provided FieldValues type
type DynamicFieldValue = FieldValues;

// Type for the API payload, adjusting for the fields format
type UpdateProductPayload = Omit<Product, '_id' | 'fields' | 'createdAt' | 'updatedAt'> & {
    // Keep fields as either Record<string,string> or undefined for API
    fields?: Record<string, string>;
};

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { accessToken } = useUser();

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    // Store field values as array for component usage
    const [dynamicFieldValues, setDynamicFieldValues] = useState<DynamicFieldValue[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [productResponse, categoriesResponse] = await Promise.all([
                    axiosInstance.get(`/product/${id}`, {
                        headers: { 'cache-control': 'no-cache' }
                    }),
                    axiosInstance.get('/product/category')
                ]);

                if (!isMounted) return;

                const productData = productResponse.data as Product;
                const categoriesData = categoriesResponse.data?.categories || categoriesResponse.data || [];

                setProduct(productData);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);

                // Handle category and fields initialization
                if (productData.category?._id) {
                    const categoryId = productData.category._id;
                    const foundCategory = categoriesData.find((cat: Category) => cat._id === categoryId);

                    if (foundCategory) {
                        setSelectedCategory(foundCategory);
                        
                        // Convert Product.fields (Record<string,string>) to array format for form
                        const initialDynamicFields: DynamicFieldValue[] = [];
                        
                        // Check if fields exists and handle either object or array format
                        if (productData.fields) {
                            if (typeof productData.fields === 'object' && !Array.isArray(productData.fields)) {
                                // If fields is an object (Record<string,string>), convert to array format
                                Object.entries(productData.fields).forEach(([name, value]) => {
                                    initialDynamicFields.push({ name, value });
                                });
                            }
                        }
                        
                        setDynamicFieldValues(initialDynamicFields);
                    } else {
                        console.warn(`Product's category (${categoryId}) not found.`);
                        setSelectedCategory(productData.category);
                        
                        // Same conversion logic as above
                        const initialDynamicFields: DynamicFieldValue[] = [];
                        
                        if (productData.fields) {
                            if (typeof productData.fields === 'object' && !Array.isArray(productData.fields)) {
                                Object.entries(productData.fields).forEach(([name, value]) => {
                                    initialDynamicFields.push({ name, value });
                                });
                            }
                        }
                        
                        setDynamicFieldValues(initialDynamicFields);
                    }
                } else {
                    setSelectedCategory(null);
                    setDynamicFieldValues([]);
                }

            } catch (err) {
                console.error('Error fetching product data:', err);
                if (isMounted) setError('Failed to load product data');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [id]);

    // --- Form Handlers ---
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => {
            if (!prev) return null;
            let processedValue: string | number | undefined = value;
            if (name === 'price') processedValue = parseFloat(value) || 0;
            else if (name === 'stock') {
                processedValue = parseInt(value, 10);
                if (isNaN(processedValue)) processedValue = undefined;
            } else if (name === 'status' && !['active', 'inactive', 'draft'].includes(value)) {
                processedValue = 'draft';
            }
            return { ...prev, [name]: processedValue };
        });
    }, []);

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = e.target.value;
        const newSelectedCategory = categories.find(c => c._id === categoryId) || null;
        setSelectedCategory(newSelectedCategory);
        
        // Update product with the complete category object, not just ID
        setProduct(prev => prev ? { ...prev, category: newSelectedCategory! } : null);

        if (newSelectedCategory) {
            // Initialize fields based on category definition
            const newDynamicFields = newSelectedCategory.fields.map(categoryFieldDef => {
                const existingField = dynamicFieldValues.find(df => df.name === categoryFieldDef.name);
                return { name: categoryFieldDef.name, value: existingField?.value || '' };
            });
            setDynamicFieldValues(newDynamicFields);
        } else {
            setDynamicFieldValues([]);
        }
    }, [categories, dynamicFieldValues]);

    const handleDynamicFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(`Dynamic field changed: ${name} = ${value}`);
        setDynamicFieldValues(prevFields => {
            const fieldIndex = prevFields.findIndex(field => field.name === name);
            if (fieldIndex !== -1) {
                const updatedFields = [...prevFields];
                updatedFields[fieldIndex] = { ...updatedFields[fieldIndex], value };
                return updatedFields;
            }
            return [...prevFields, { name, value }];
        });
    }, []);

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const productId = product._id;
            if (!productId) throw new Error('Product ID is missing');
            
            // Convert the dynamic field values from array format to object format for API
            const fieldValues: Record<string, string> = {};
            dynamicFieldValues.forEach(field => {
                fieldValues[field.name] = field.value;
            });
            
            const payload: UpdateProductPayload = {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                sku: product.sku,
                status: product.status,
                images: product.images,
                category: product.category, // Send full category object as per type definition
                fields: Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
                createdBy: product.createdBy,
            };
            console.log('Payload for update:', payload);
            // Remove undefined optional fields
            (Object.keys(payload) as Array<keyof UpdateProductPayload>).forEach(key => {
                if (payload[key] === undefined) delete payload[key];
            });
            
            console.log(`Updating product with ID: ${productId}`, payload);
            
            const response = await axiosInstance.put(`/product/${productId}`, payload, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }
            });
            
            if (response.status >= 200 && response.status < 300) {
                const updatedProductData = response.data as Product;
                setProduct(updatedProductData);
                
                // Update the selected category
                if (updatedProductData.category?._id) {
                    const foundCategory = categories.find((cat: Category) => cat._id === updatedProductData.category._id);
                    setSelectedCategory(foundCategory || updatedProductData.category);
                } else {
                    setSelectedCategory(null);
                }
                
                // Update dynamic fields based on response
                // Convert from API's Record<string,string> format to array format for UI
                const updatedFields: DynamicFieldValue[] = [];
                if (updatedProductData.fields && typeof updatedProductData.fields === 'object' && !Array.isArray(updatedProductData.fields)) {
                    Object.entries(updatedProductData.fields).forEach(([name, value]) => {
                        updatedFields.push({ name, value });
                    });
                }
                setDynamicFieldValues(updatedFields);
                
                setSuccess('Product updated successfully!');
                setTimeout(() => {
                     navigate(`/admin/products/${productId}`, { state: { message: 'Product updated successfully!' } });
                }, 1500);
            } else {
                throw new Error(response.statusText || `Update failed with status ${response.status}`);
            }
        } catch (err: unknown) {
            console.error('Error updating product:', err);
            let errorMessage = 'Failed to update product.';
            if (axios.isAxiosError(err)) errorMessage = err.response?.data?.message || `Server error: ${err.response?.status}` || err.message;
            else if (err instanceof Error) errorMessage = err.message;
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
    }
    if (error && !product) {
        return <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center max-w-lg mx-auto"><p className="text-red-600 mb-4">{error}</p><Link to="/admin/products" className="text-blue-500 hover:underline">Return to Products</Link></div>;
    }
    if (!product) {
        return <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center max-w-lg mx-auto"><p className="text-yellow-700 mb-4">Product not found.</p><Link to="/admin/products" className="text-blue-500 hover:underline">Return to Products</Link></div>;
    }

    // --- Form JSX ---
    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <ProductFormHeader
                productId={id}
                productName={product?.name}
                isEditMode={true}
            />

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600">{success}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Column 1 */}
                    <div className="space-y-6">
                        <BasicInfoSection product={product} onChange={handleInputChange} />
                        <PricingInventorySection product={product} onChange={handleInputChange} />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <OrganizationSection
                            product={product}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                            onStatusChange={handleInputChange} // Use the general handler
                        />
                        <DynamicFieldsSection
                            selectedCategory={selectedCategory}
                            dynamicFieldValues={dynamicFieldValues}
                            onChange={handleDynamicFieldChange}
                        />
                    </div>
                </div>

                <ProductFormActions isSaving={saving} isLoading={loading} />
            </form>
        </div>
    );
};

export default EditProduct;