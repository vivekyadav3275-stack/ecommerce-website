import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/helpers';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} items in stock`);
          return prev;
        }
        toast.success('Cart updated!');
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items in stock`);
        return prev;
      }
      toast.success(`${product.name} added to cart!`);
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.discountedPrice || product.price,
          originalPrice: product.price,
          image: getImageUrl(product),
          stock: product.stock,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    toast.success('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== productId) return item;
        if (quantity > item.stock) {
          toast.error(`Only ${item.stock} items available`);
          return item;
        }
        return { ...item, quantity };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = cartSubtotal > 999 ? 0 : 99;
  const taxPrice = Math.round(cartSubtotal * 0.18);
  const cartTotal = cartSubtotal + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        shippingPrice,
        taxPrice,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
