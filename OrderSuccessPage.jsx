import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import API from '../utils/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import Spinner from '../components/common/Spinner';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  return (
    <div className="page-container max-w-2xl fade-in">
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-stone-500">
          Thank you for your purchase. We'll send you updates as your order progresses.
        </p>
      </div>

      {order && (
        <div className="card p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Order ID', value: `#${order._id.slice(-8).toUpperCase()}` },
              { label: 'Date', value: formatDate(order.createdAt) },
              { label: 'Payment', value: order.paymentMethod.toUpperCase() },
              {
                label: 'Status',
                value: <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>,
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-xs text-stone-500 mb-1">{label}</p>
                <p className="font-semibold text-stone-800 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" /> Order Items
            </h3>
            <div className="space-y-3">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-stone-800">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-sm text-stone-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
            <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-100 pt-2">
              <span>Total</span>
              <span className="text-orange-500">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Delivering to</p>
              <p className="text-sm text-stone-700">
                {order.shippingAddress.fullName}, {order.shippingAddress.phone}
              </p>
              <p className="text-sm text-stone-500">
                {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Link to="/orders" className="btn-secondary flex-1 text-center flex items-center justify-center gap-2">
          <Package className="w-4 h-4" /> View All Orders
        </Link>
        <Link to="/" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
          <Home className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
