import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import API from '../../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await API.get('/admin/dashboard');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 flex justify-center items-center min-h-96"><Spinner size="lg" /></div>
    </div>
  );

  const { stats, recentOrders, lowStockProducts } = data || {};

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'bg-green-50 text-green-600', trend: '+12%' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', trend: '+8%' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-orange-50 text-orange-600', trend: '+3%' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-purple-50 text-purple-600', trend: '+15%' },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-stone-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, icon: Icon, color, trend }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />{trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-stone-900">{value}</p>
                <p className="text-stone-500 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-stone-800">Recent Orders</h2>
                <Link to="/admin/orders" className="text-orange-500 text-sm hover:text-orange-600 flex items-center gap-1 font-medium">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders?.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-6">No orders yet</p>
                ) : (
                  recentOrders?.map((order) => (
                    <Link
                      key={order._id}
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">
                          {order.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-stone-400">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-stone-800">{formatPrice(order.totalPrice)}</p>
                        <span className={`badge ${getStatusColor(order.orderStatus)} text-xs`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-stone-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock
                </h2>
                <Link to="/admin/products" className="text-orange-500 text-sm hover:text-orange-600 font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {lowStockProducts?.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-6">All products well stocked</p>
                ) : (
                  lowStockProducts?.map((product) => (
                    <Link
                      key={product._id}
                      to={`/admin/products/${product._id}/edit`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors"
                    >
                      <img
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-stone-800 truncate">{product.name}</p>
                        <p className="text-xs text-stone-400">{product.category}</p>
                      </div>
                      <span className={`badge text-xs ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.stock} left
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
