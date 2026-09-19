import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ShippingAddress } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  shippingAddress: ShippingAddress;
  saveShippingAddress: (address: ShippingAddress) => void;
  paymentMethod: string;
  savePaymentMethod: (method: string) => void;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  itemCount: number;
}

const defaultShippingAddress: ShippingAddress = {
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Only load cart from localStorage if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return [];
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    const saved = localStorage.getItem('shippingAddress');
    return saved ? JSON.parse(saved) : defaultShippingAddress;
  });

  const [paymentMethod, setPaymentMethod] = useState<string>(() => {
    return localStorage.getItem('paymentMethod') || 'Razorpay';
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, qty: number = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x.product === product._id
            ? { ...x, qty: Math.min(x.countInStock, x.qty + qty) }
            : x
        );
      } else {
        return [
          ...prevItems,
          {
            _id: product._id,
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === id ? { ...x, qty: Math.min(x.countInStock, qty) } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const saveShippingAddress = (data: ShippingAddress) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (method: string) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', method);
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 15;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
