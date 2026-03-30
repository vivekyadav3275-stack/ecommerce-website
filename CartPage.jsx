import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartPage() {
  const { cartItems, cartCount, cartSubtotal, shippingPrice, taxPrice, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-orange-300" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-3">Your cart is empty</h2>
          <p className="text-stone-500 mb-8 max-w-sm">Looks like you haven't added anything yet. Discover thousands of great products!</p>
          <Link to="/products" className="btn-primary flex items-center gap-2">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <h1 className="section-title mb-2">Shopping Cart</h1>
      <p className="text-stone-500 text-sm mb-8">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4">
              <Link to={`/products/${item._id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/products/${item._id}`} className="font-semibold text-stone-800 hover:text-orange-600 text-sm leading-snug line-clamp-2 transition-colors">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-orange-500 font-bold mt-1">{formatPrice(item.price)}</p>
                {item.originalPrice > item.price && (
                  <p className="text-stone-400 text-xs line-through">{formatPrice(item.originalPrice)}</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-bold text-stone-800 text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-bold text-stone-800 text-lg mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal ({cartCount} items)</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-600 font-semibold' : ''}>
                  {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Tax (18% GST)</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
              {shippingPrice > 0 && (
                <div className="bg-orange-50 rounded-xl p-3 text-xs text-orange-700 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                  Add {formatPrice(999 - cartSubtotal)} more for FREE shipping!
                </div>
              )}
              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span className="text-orange-500 text-lg">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center block !py-3.5 rounded-2xl text-base">
              Proceed to Checkout →
            </Link>

            <Link to="/products" className="btn-secondary w-full text-center block !py-3 rounded-2xl text-sm mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
