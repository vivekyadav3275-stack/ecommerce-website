import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, ArrowLeft, XCircle } from 'lucide-react';
import API from '../utils/api';
import { formatPrice, formatDate, formatDateTime, getStatusColor } from '../utils/helpers';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await API.put(`/orders/${id}/cancel`);
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!order) return (
    <div className="page-container text-center py-20">
      <h2 className="text-xl font-bold text-stone-700">Order not found</h2>
      <Link to="/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="page-container max-w-4xl fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/orders" className="flex items-center gap-1.5 text-stone-500 hover:text-orange-500 text-sm mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <h1 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-stone-500 text-sm mt-1">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${getStatusColor(order.orderStatus)} text-sm px-3 py-1`}>
            {order.orderStatus}
          </span>
          {!['delivered', 'cancelled'].includes(order.orderStatus) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="btn-danger !py-2 !px-4 text-sm flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              {cancelling ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      {order.orderStatus !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-stone-100 -z-0" />
            <div
              className="absolute left-0 top-5 h-0.5 bg-orange-400 transition-all duration-500"
              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i <= currentStep
                      ? 'bg-orange-500 text-white'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium capitalize ${i <= currentStep ? 'text-orange-600' : 'text-stone-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <p className="text-sm text-stone-600 mt-4 text-center">
              Tracking: <span className="font-mono font-bold text-stone-800">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" /> Items Ordered
            </h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-stone-800 text-sm">{item.name}</p>
                    <p className="text-stone-500 text-xs mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-bold text-stone-800">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-5">
            <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" /> Shipping Address
            </h3>
            <div className="text-sm text-stone-600 space-y-1">
              <p className="font-semibold text-stone-800">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-500" /> Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Method</span>
                <span className="font-semibold text-stone-800 uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Status</span>
                <span className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-stone-800 mb-4">Price Details</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
              <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-900">
                <span>Total</span>
                <span className="text-orange-500">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
