import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import API from '../../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await API.get('/orders', { params });
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
            <p className="text-stone-500 text-sm mt-1">Manage and track all customer orders</p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 overflow-x-auto">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                  statusFilter === s ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-stone-400">No orders found</div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link to={`/orders/${order._id}`} className="text-sm font-mono text-orange-600 hover:text-orange-700 font-medium">
                            #{order._id.slice(-8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-stone-800">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs text-stone-400">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-stone-600">{order.orderItems?.length} item{order.orderItems?.length > 1 ? 's' : ''}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-stone-800">{formatPrice(order.totalPrice)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-xs font-medium text-stone-600 uppercase">{order.paymentMethod}</span>
                            <div>
                              <span className={`badge text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${getStatusColor(order.orderStatus)} text-xs capitalize`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-stone-500">{formatDate(order.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          {updatingId === order._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                            >
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
