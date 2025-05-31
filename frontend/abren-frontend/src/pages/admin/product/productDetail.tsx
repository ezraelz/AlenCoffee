import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axios';

interface Product {
    id: string;
    name:string;
    price: number;
    category: string;
    stock: string;
    created_at: string;
  }

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`/products/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status !== 200) throw new Error('product not found');
        setProduct(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert('Update failed: ' + err.message);
        } else {
          alert('Update failed: An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  if (loading) return <div>Loading order details...</div>;
  if (!product) return <div>No product data available</div>;

  return (
    <div className="product-detail">
      <h2>Product Detail</h2>
      <div className="detail-card">
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Product:</strong> {product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Created At:</strong> {product.created_at}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
