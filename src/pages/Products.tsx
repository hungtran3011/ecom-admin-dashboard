import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/products';

type Product = {
  id: string;
  name: string;
  price: number;
  // add other fields as needed
};

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="p-4 border rounded shadow bg-white">
              <p className="font-bold">{product.name}</p>
              <p className="text-gray-600">${product.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
