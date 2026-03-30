import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import StarRating from './StarRating';
import { formatPrice, discountPercent, getImageUrl } from '../../utils/helpers';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const discount = discountPercent(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;
  const imgUrl = imgError
    ? 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'
    : getImageUrl(product);

  return (
    <div className="card group hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Link to={`/products/${product._id}`}>
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-orange-500 text-white text-xs font-bold">-{discount}%</span>
          )}
          {product.featured && (
            <span className="badge bg-amber-400 text-amber-900 text-xs">Featured</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-stone-700 text-white text-xs">Out of Stock</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setWishlist((v) => !v)}
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <Heart className={`w-4 h-4 ${wishlist ? 'text-red-500 fill-red-500' : 'text-stone-400'}`} />
          </button>
          <Link
            to={`/products/${product._id}`}
            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-stone-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-stone-400" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/products/${product._id}`}>
          <h3 className="text-stone-800 font-semibold text-sm leading-snug line-clamp-2 hover:text-orange-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.ratings} numReviews={product.numReviews} />

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-stone-900 font-bold text-base">{formatPrice(displayPrice)}</span>
            {discount > 0 && (
              <span className="text-stone-400 text-xs line-through ml-2">{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            onClick={() => product.stock > 0 && addToCart(product, 1)}
            disabled={product.stock === 0}
            className="w-9 h-9 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-200 rounded-xl flex items-center justify-center transition-colors active:scale-95"
            title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
