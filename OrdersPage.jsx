import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import API from '../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div className="page-container max-w-4xl fade-in">
      <h1 className="section-title mb-2">My Orders</h1>
      <p className="text-stone-500 text-sm mb-8">{orders.length} orders placed</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-orange-300" />
          </div>
          <h3 className="text-xl font-bold text-stone-700 mb-2">No orders yet</h3>
          <p className="text-stone-500 mb-6">Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 group"
            >
              {/* First product image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                {order.orderItems?.[0]?.image ? (
                  <img
                    src={order.orderItems[0].image}
                    alt={order.orderItems[0].name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-stone-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-stone-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-stone-800 font-semibold text-sm truncate">
                  {order.orderItems?.map((i) => i.name).join(', ')}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                  <span>{formatDate(order.createdAt)}</span>
                  <span>·</span>
                  <span>{order.orderItems?.length} item{order.orderItems?.length > 1 ? 's' : ''}</span>
                  <span>·</span>
                  <span>{order.paymentMethod.toUpperCase()}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-stone-900">{formatPrice(order.totalPrice)}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-orange-500 text-xs font-medium">
                  View Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
