import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

interface Product {
  name: string;
  id: number;
  image: string;
}

const NavShopProduct = () => {
  const [ products, setProducts] = useState<Product[]>([]);

    useEffect(()=> {
    const fetchProducts = async () => {
        const response = await axios.get('/products/list');
        setProducts(response.data);
    }
    fetchProducts();
    }, []);

  return (
    <div className="shop-products">
      {products.length > 0 ? (
        <div className="product-imgs">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              className="product-nav-img"
              key={product.id}
            >
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NavShopProduct;
