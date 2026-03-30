import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Search } from 'lucide-react';
import API from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';

const CATEGORIES = [
  { name: 'Electronics', emoji: '📱', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { name: 'Clothing', emoji: '👗', color: 'bg-pink-50 text-pink-600 border-pink-100' },
  { name: 'Books', emoji: '📚', color: 'bg-green-50 text-green-600 border-green-100' },
  { name: 'Home & Kitchen', emoji: '🏠', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { name: 'Sports', emoji: '⚽', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { name: 'Beauty', emoji: '💄', color: 'bg-purple-50 text-purple-600 border-purple-100' },
];

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999', color: 'text-blue-500' },
  { icon: Shield, title: 'Secure Payments', desc: '100% secure checkout', color: 'text-green-500' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-purple-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here for you', color: 'text-orange-500' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newestRes] = await Promise.all([
          API.get('/products/featured'),
          API.get('/products?sort=newest&limit=8'),
        ]);
        setFeatured(featuredRes.data.products);
        setNewest(newestRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              🛍️ New Arrivals Every Day
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 leading-tight mb-6">
              Shop Smarter,{' '}
              <span className="text-orange-500">Live Better</span>
            </h1>
            <p className="text-stone-500 text-lg mb-8 max-w-xl mx-auto">
              Discover thousands of products at unbeatable prices. Free shipping on orders above ₹999.
            </p>

            {/* Hero Search */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm text-sm"
                />
              </div>
              <button type="submit" className="btn-primary !py-3.5 !px-6 rounded-2xl">
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/products" className="btn-primary flex items-center gap-2 rounded-2xl">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary flex items-center gap-2 rounded-2xl">
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-stone-800 font-semibold text-sm">{title}</p>
                  <p className="text-stone-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page-container space-y-16">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/products" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
              All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map(({ name, emoji, color }) => (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(name)}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${color} hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold text-center leading-tight">{name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <>
            {featured.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="section-title">Featured Products</h2>
                    <p className="text-stone-500 text-sm mt-1">Hand-picked favorites just for you</p>
                  </div>
                  <Link to="/products?featured=true" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featured.slice(0, 4).map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {/* New Arrivals */}
            {newest.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="section-title">New Arrivals</h2>
                    <p className="text-stone-500 text-sm mt-1">Fresh picks, just landed</p>
                  </div>
                  <Link to="/products?sort=newest" className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newest.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">🎉 Special Offer!</h2>
          <p className="text-orange-100 mb-6 text-lg">Get FREE shipping on your first order. No minimum required!</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-2xl hover:bg-orange-50 transition-colors">
            Sign Up Now <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
