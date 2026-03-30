import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Package, Truck, Shield } from 'lucide-react';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import StarRating from '../components/common/StarRating';
import { formatPrice, discountPercent, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) return toast.error('Please select a rating');
    if (!reviewComment.trim()) return toast.error('Please write a review');

    setSubmittingReview(true);
    try {
      await API.post(`/products/${id}/review`, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewRating(0);
      setReviewComment('');
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!product) return (
    <div className="page-container text-center py-24">
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Product not found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  );

  const discount = discountPercent(product.price, product.discountedPrice);
  const displayPrice = product.discountedPrice || product.price;

  return (
    <div className="page-container fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-orange-500 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i ? 'border-orange-500' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="badge bg-orange-100 text-orange-700 mb-3">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.ratings} numReviews={product.numReviews} size="md" />
            <span className="text-sm text-stone-500">{product.sold} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-stone-900">{formatPrice(displayPrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-stone-400 line-through text-lg">{formatPrice(product.price)}</span>
                <span className="badge bg-green-100 text-green-700 text-sm">Save {discount}%</span>
              </>
            )}
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock & Brand */}
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-stone-500 mb-0.5">Brand</p>
              <p className="font-semibold text-stone-800">{product.brand || 'Generic'}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <p className="text-stone-500 mb-0.5">Stock</p>
              <p className={`font-semibold ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-stone-700">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-semibold text-stone-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 !py-3.5 rounded-2xl text-base"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Guarantees */}
          <div className="space-y-3 border-t border-stone-100 pt-6">
            {[
              { icon: Truck, text: 'Free delivery on orders above ₹999' },
              { icon: Shield, text: '30-day return policy' },
              { icon: Package, text: 'Secure & tamper-proof packaging' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-stone-600">
                <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Review Summary */}
        <div className="card p-6 text-center">
          <div className="text-5xl font-bold text-stone-900 mb-2">{product.ratings?.toFixed(1) || '0.0'}</div>
          <StarRating rating={product.ratings} size="lg" />
          <p className="text-stone-500 text-sm mt-2">{product.numReviews} reviews</p>
        </div>

        {/* Review List */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="section-title">Customer Reviews</h3>

          {product.reviews?.length === 0 ? (
            <div className="card p-8 text-center">
              <Star className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No reviews yet. Be the first!</p>
            </div>
          ) : (
            product.reviews?.slice(0, 5).map((review) => (
              <div key={review._id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-xs font-bold">{review.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{review.name}</p>
                      <p className="text-stone-400 text-xs">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-stone-600 text-sm">{review.comment}</p>
              </div>
            ))
          )}

          {/* Write Review */}
          {user && (
            <div className="card p-6 mt-4">
              <h4 className="font-bold text-stone-800 mb-4">Write a Review</h4>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Your Rating</label>
                  <StarRating rating={reviewRating} size="lg" interactive onRate={setReviewRating} />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience..."
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
