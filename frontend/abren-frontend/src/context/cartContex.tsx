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
  cartItems: CartItem[];
  cartItemCount: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  updateItemQuantity: (productId: number, newQuantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
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

  const cartItems = cart.cart_items;
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.total_price;

  const addItem = async (product: Product, quantity: number = 1) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        '/cart/add/',
        { product_id: product.id, quantity },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      await fetchCartData();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItemQuantity = async (productId: number, newQuantity: number) => {
    try {
      const token = localStorage.getItem('access_token');
  
      if (newQuantity < 1) {
        // Automatically delete the item if quantity < 1
        await axios.delete(`/cart/delete/${productId}/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
      } else {
        // Otherwise, update the quantity
        await axios.put(
          `/cart/update/${productId}/`,
          { quantity: newQuantity },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          }
        );
      }
  
      await fetchCartData(); // Refresh cart
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };
  

  const removeItem = async (productId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`/cart/delete/${productId}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      await fetchCartData(); // Refresh cart
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        '/cart/clear/',
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      await fetchCartData();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        totalPrice,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
