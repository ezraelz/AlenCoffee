import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import './single_product.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

interface SingleProductProps {
  handleAddToCart: (product: Product) => void;
}

const SingleProduct: React.FC<SingleProductProps> = ({ handleAddToCart }) => {
  interface CartItem {
    product: Product;
    quantity: number;
  }
  
  interface Cart {
    cart_items: CartItem[];
  }
  
  const [cart, setCart] = useState<Cart | null>(null);
  const { id } = useParams<{ id: string }>();
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Determine if the product is out of stock
  const isOutOfStock = singleProduct?.stock === 0;

  //single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/products/detail/${id}/`);
        setSingleProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/products/list/`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async ()=>  {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
        };
        const response = await axios.get('http://127.0.0.1:8000/cart/', config);
        console.log(response.data)
        setCart(response.data);
    };

    fetchData();
  }, [])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!singleProduct) return <p>Product not found.</p>;

  // Assuming the image URL returned is relative, prepend the base URL
  const imageUrl = singleProduct.image.startsWith('http') ? singleProduct.image : `http://127.0.0.1:8000${singleProduct.image}`;

  // Define cart or remove this logic if not needed
  const isProductInCart = cart?.cart_items?.some((item) => item.product.id === singleProduct?.id) ?? false;
  
  return (
    <div className="single-product">
        <div className="product-grid">
            <article className="product-card">
                <img src={imageUrl} alt={singleProduct.name} />
                <div className="description">
                  <h2>{singleProduct.name}</h2>
                  <p>Price: ${Number(singleProduct.price).toFixed(2)}</p>
                  <p>{singleProduct.description}</p>
                  <button
                      className='addCart'
                      onClick={() => handleAddToCart(singleProduct)}  // Pass the correct product to the handler
                      disabled={loading || isOutOfStock}
                      type="button"
                      >
                      {isProductInCart? 'InCart' : loading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>           
            </article>
        </div>
        <div className="related-products">
          {products.length > 0 ? (
            <>
              <h3>Related Products</h3>
              {products.map((product, index) => (
                <div className="product-card" key={index}>
                  <img src={product.image} alt="" />
                  <p>{product.name}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              <p>No Products found!</p>
            </>
          )}
        </div>
    </div>
  );
};

export default SingleProduct;
