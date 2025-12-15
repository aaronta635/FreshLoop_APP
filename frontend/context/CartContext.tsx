import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { cartApi, CartSummary, PaymentMethod } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartSummary | null;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (paymentMethod?: PaymentMethod) => Promise<any>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  // Check if user is a customer (not a shop/admin)
  const isCustomer = isAuthenticated && user?.role === 'customer';

  // Fetch cart when customer authenticates (vendors don't have carts)
  useEffect(() => {
    if (isCustomer) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isCustomer]);

  const refreshCart = useCallback(async () => {
    if (!isCustomer) return;
    
    try {
      setIsLoading(true);
      const summary = await cartApi.getCartSummary();
      setCart(summary);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ cart_items: [], total_items_quantity: 0, total_amount: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [isCustomer]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setIsLoading(true);
      await cartApi.addToCart({ product_id: productId, quantity });
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      if (quantity <= 0) {
        await cartApi.removeFromCart(productId);
      } else {
        await cartApi.updateCart({ product_id: productId, quantity });
      }
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setIsLoading(true);
      await cartApi.removeFromCart(productId);
      await refreshCart();
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await cartApi.clearCart();
      setCart({ cart_items: [], total_items_quantity: 0, total_amount: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = async (paymentMethod: PaymentMethod = 'card') => {
    try {
      setIsLoading(true);
      const result = await cartApi.checkout({
        payment_details: {
          payment_method: paymentMethod,
        }
      });
      setCart({ cart_items: [], total_items_quantity: 0, total_amount: 0 });
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

