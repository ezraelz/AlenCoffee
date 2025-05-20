import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

interface Product {
  id: string;
  name:string;
  price: number;
  category: string;
  stock: string;
  created_at: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/products/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data);
    };

    fetchAllProducts();
  }, []);

  return (
    <div className='product-list'>
      <h1>All Products</h1>
      <div className='product-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Catagory</th>
              <th>Stock</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index)=>(
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.created_at}</td>
                </tr>
              ))
            ) : (
              <tr>
              <td colSpan={6} className="text-center">
                No Product found.
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;

