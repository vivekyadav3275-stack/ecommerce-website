import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import API from '../../utils/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.keyword = search;
      const { data } = await API.get('/products', { params });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Products</h1>
              <p className="text-stone-500 text-sm mt-1">Manage your product catalog</p>
            </div>
            <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="input-field pl-10 max-w-sm"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No products found</p>
              <Link to="/admin/products/new" className="btn-primary mt-4 inline-block">Add First Product</Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Product</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Category</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Stock</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Rating</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(product)}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-stone-800 truncate max-w-[200px]">{product.name}</p>
                              <p className="text-xs text-stone-400">{product.brand || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-stone-100 text-stone-600 text-xs">{product.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-stone-800">{formatPrice(product.discountedPrice || product.price)}</p>
                            {product.discountedPrice > 0 && (
                              <p className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${
                            product.stock === 0 ? 'bg-red-100 text-red-700' :
                            product.stock <= 10 ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-stone-600">
                            ⭐ {product.ratings?.toFixed(1) || '—'} ({product.numReviews})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              disabled={deleting === product._id}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              {deleting === product._id ? (
                                <Spinner size="sm" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 border-t border-stone-100">
                  <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn-secondary !py-1.5 !px-3 text-sm disabled:opacity-40">Prev</button>
                  <span className="text-sm text-stone-600">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="btn-secondary !py-1.5 !px-3 text-sm disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
