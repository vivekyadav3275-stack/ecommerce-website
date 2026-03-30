import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-orange-400">Ease</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Your one-stop destination for quality products. Fast shipping, easy returns, and great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-orange-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-orange-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-orange-400 transition-colors">Clothing</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-orange-400 transition-colors">Books</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-orange-400 transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-orange-400 transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-orange-400 transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                support@shopease.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm">© 2025 ShopEase. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-stone-500">
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-orange-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
