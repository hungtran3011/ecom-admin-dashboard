export type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    stock?: number;
    sku?: string;
    status?: 'active' | 'inactive' | 'draft';
    images?: string[];
    fields?: Record<string, string>;
    createdBy?: string;
    updatedAt?: string;
};

// Updated Category type to match the API response
export type Category = {
    _id: string;
    name: string;
    description: string;
    fields: {
        _id: string;
        name: string;
        type: string;
        required: boolean;
    }[];
    createdBy: string;
};

export type FieldValues = {
    name: string;
    value: string;
}