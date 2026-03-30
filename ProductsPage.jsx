import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Grocery', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 12 };
      if (keyword) params.keyword = keyword;
      if (category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await API.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = keyword || category !== 'All' || minPrice || maxPrice;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">
            {keyword ? `Results for "${keyword}"` : category !== 'All' ? category : 'All Products'}
          </h1>
          <p className="text-stone-500 text-sm mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
              <X className="w-4 h-4" /> Clear Filters
            </button>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-2 btn-secondary !py-2 !px-3 text-sm md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="input-field !py-2 !w-auto text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-60 flex-shrink-0`}>
          <div className="card p-5 sticky top-20 space-y-6">
            <h3 className="font-bold text-stone-800">Filters</h3>

            {/* Category */}
            <div>
              <h4 className="text-sm font-semibold text-stone-700 mb-3">Category</h4>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === cat
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-semibold text-stone-700 mb-3">Price Range (₹)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="input-field !py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="input-field !py-2 text-sm"
                />
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="w-full btn-danger !py-2 text-sm">
                Clear All
              </button>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-stone-700 mb-2">No products found</h3>
              <p className="text-stone-500 mb-6">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => updateParam('page', page - 1)}
                    disabled={page === 1}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const p_ = i + 1;
                      return (
                        <button
                          key={p_}
                          onClick={() => updateParam('page', p_)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            page === p_ ? 'bg-orange-500 text-white' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                          }`}
                        >
                          {p_}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => updateParam('page', page + 1)}
                    disabled={page === totalPages}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
