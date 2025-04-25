import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import { useUser } from '../../hooks/useUser';
import { Category } from '../../types/product.types';
import DeleteConfirmationModal from '../../components/common/DeleteConfirmationModal';
import Pagination from '../../components/common/Pagination';
import CategoryFieldsList from '../../components/category/CategoryFieldsList';

const Categories: React.FC = () => {
    const { accessToken } = useUser();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axiosInstance.get(`/product/category`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            // Handle different API response structures
            const categoryData = response.data?.categories || response.data || [];
            const total = response.data?.total || categoryData.length;
            
            setCategories(categoryData);
            setTotalCategories(total);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError('Failed to load categories. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [accessToken, currentPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Handle category deletion
    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;
        
        try {
            await axiosInstance.delete(`/product/category/${categoryToDelete._id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            setSuccess(`Category "${categoryToDelete.name}" deleted successfully`);
            setCategories(prev => prev.filter(cat => cat._id !== categoryToDelete._id));
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
            
            // Recalculate pagination if needed
            if (categories.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                fetchCategories();
            }
        } catch (err) {
            console.error('Failed to delete category:', err);
            setError('Failed to delete category. It may be in use by products.');
            setDeleteModalOpen(false);
        }
    };

    // Toggle category details view
    const toggleCategoryExpand = (categoryId: string) => {
        setExpandedCategory(prev => prev === categoryId ? null : categoryId);
    };

    // Handle pagination changes
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Product Categories</h1>
                <Link 
                    to="/admin/categories/new" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add New Category
                </Link>
            </div>

            {/* Categories List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No categories found.</p>
                        <Link to="/admin/categories/new" className="text-blue-500 underline mt-2 inline-block">
                            Create your first category
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map(category => (
                                    <React.Fragment key={category._id}>
                                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleCategoryExpand(category._id)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {category.description || 'No description'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {category.fields?.length || 0} fields
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                                                    <Link 
                                                        to={`/admin/categories/${category._id}`} 
                                                        className="text-blue-600 hover:text-blue-900 mdi"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        className="text-red-600 hover:text-red-900 mdi"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(category);
                                                        }}
                                                    >
                                                        delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedCategory === category._id && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 bg-gray-50">
                                                    <div className="mb-4">
                                                        <h3 className="text-lg font-medium text-gray-900">Category Details</h3>
                                                        <p className="mt-2 text-sm text-gray-600">{category.description || 'No description provided.'}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-md font-medium text-gray-800 mb-2">Custom Fields</h4>
                                                        <CategoryFieldsList fields={category.fields || []} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalCategories > itemsPerPage && (
                    <div className="py-3 px-6 border-t">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalCategories}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Category"
                message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone and may affect products using this category.`}
            />
        </div>
    );
};

export default Categories;