import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number | string;
  total_price?: number;
}

export interface Cart {
  id: number;
  cart_items: CartItem[];
  total_price: number;
}

export interface CartContextType {
  cart: Cart;
  cartItemCount: number;
  fetchCartData: () => void;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ id: 0, cart_items: [], total_price: 0 });

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get<Cart>('/cart/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const cartItemCount = cart.cart_items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartItemCount, fetchCartData, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
