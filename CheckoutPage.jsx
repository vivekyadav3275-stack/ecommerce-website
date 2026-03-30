import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';

const STEPS = ['Address', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, shippingPrice, taxPrice, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
  });

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'street', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!address[field]?.trim()) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartSubtotal,
        shippingPrice,
        taxPrice,
        totalPrice: cartTotal,
      };

      if (paymentMethod === 'razorpay') {
        // Razorpay flow
        const { data: rzpData } = await API.post('/payment/razorpay/create-order', { amount: cartTotal });

        const options = {
          key: rzpData.key,
          amount: rzpData.order.amount,
          currency: 'INR',
          name: 'ShopEase',
          description: 'Order Payment',
          order_id: rzpData.order.id,
          handler: async (response) => {
            try {
              await API.post('/payment/razorpay/verify', response);
              const { data: orderRes } = await API.post('/orders', orderData);
              await API.put(`/orders/${orderRes.order._id}/pay`, {
                id: response.razorpay_payment_id,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: user.email,
              });
              clearCart();
              navigate(`/order-success/${orderRes.order._id}`);
            } catch (err) {
              toast.error('Payment verification failed');
            }
          },
          prefill: { name: address.fullName, contact: address.phone, email: user?.email },
          theme: { color: '#f97316' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
        return;
      }

      // COD or Stripe
      const { data } = await API.post('/orders', orderData);

      if (paymentMethod === 'cod') {
        clearCart();
        navigate(`/order-success/${data.order._id}`);
        toast.success('Order placed! Pay on delivery.');
      } else {
        // Stripe – simplified (would normally use Stripe Elements)
        toast.info('Stripe integration requires frontend Stripe Elements setup');
        clearCart();
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-5xl fade-in">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                i === step ? 'bg-orange-500 text-white' :
                i < step ? 'bg-green-100 text-green-700 cursor-pointer' :
                'bg-stone-100 text-stone-400'
              }`}
            >
              {i < step ? <CheckCircle className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">{i + 1}</span>}
              {s}
            </button>
            {i < STEPS.length - 1 && <div className={`w-12 h-0.5 mx-1 ${i < step ? 'bg-green-300' : 'bg-stone-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-stone-800 text-lg">Delivery Address</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', name: 'fullName', placeholder: 'John Doe' },
                  { label: 'Phone', name: 'phone', placeholder: '9876543210' },
                  { label: 'Street Address', name: 'street', placeholder: '123 Main St', full: true },
                  { label: 'City', name: 'city', placeholder: 'Mumbai' },
                  { label: 'State', name: 'state', placeholder: 'Maharashtra' },
                  { label: 'PIN Code', name: 'pincode', placeholder: '400001' },
                ].map(({ label, name, placeholder, full }) => (
                  <div key={name} className={full ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={address[name]}
                      onChange={handleAddressChange}
                      placeholder={placeholder}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => validateAddress() && setStep(1)} className="btn-primary mt-6 w-full !py-3.5 rounded-2xl">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-stone-800 text-lg">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  { value: 'razorpay', label: 'Razorpay', desc: 'UPI, cards, netbanking & more', icon: '💳' },
                  { value: 'stripe', label: 'Credit / Debit Card (Stripe)', desc: 'Visa, Mastercard, Amex', icon: '🏧' },
                ].map(({ value, label, desc, icon }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === value ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                      className="accent-orange-500"
                    />
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{label}</p>
                      <p className="text-stone-500 text-xs">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1 rounded-2xl">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1 rounded-2xl">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-stone-800 text-lg">Review Your Order</h2>
              </div>

              {/* Address Summary */}
              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-stone-700">Delivering to</span>
                </div>
                <p className="text-sm text-stone-600">
                  {address.fullName}, {address.phone}<br />
                  {address.street}, {address.city}, {address.state} – {address.pincode}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 rounded-2xl">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-1 rounded-2xl flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner size="sm" /> Processing...</> : 'Place Order 🎉'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h3 className="font-bold text-stone-800 mb-4">Order Summary</h3>
          <div className="space-y-2.5 text-sm text-stone-600 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className={shippingPrice === 0 ? 'text-green-600 font-semibold' : ''}>{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span></div>
            <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(taxPrice)}</span></div>
            <div className="border-t border-stone-100 pt-2.5 flex justify-between font-bold text-stone-900">
              <span>Total</span>
              <span className="text-orange-500">{formatPrice(cartTotal)}</span>
            </div>
          </div>
          <div className="text-xs text-stone-400 text-center">🔒 Secure checkout powered by ShopEase</div>
        </div>
      </div>
    </div>
  );
}
