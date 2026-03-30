import { useState } from 'react';
import { User, Lock, Package, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile({
      name: profile.name,
      phone: profile.phone,
      address: { street: profile.street, city: profile.city, state: profile.state, pincode: profile.pincode },
    });
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
  ];

  return (
    <div className="page-container max-w-3xl fade-in">
      <h1 className="section-title mb-8">My Account</h1>

      {/* User Card */}
      <div className="card p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-orange-600 text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900">{user?.name}</h2>
          <div className="flex items-center gap-2 text-stone-500 text-sm mt-0.5">
            <Mail className="w-3.5 h-3.5" />{user?.email}
          </div>
          <span className={`badge mt-2 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
            {user?.role === 'admin' ? '🔑 Admin' : '👤 Customer'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6">
          <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" /> Personal Information
          </h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="9876543210"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Street Address</span>
              </label>
              <input
                type="text"
                value={profile.street}
                onChange={(e) => setProfile((p) => ({ ...p, street: e.target.value }))}
                placeholder="123 Main St, Apt 4"
                className="input-field"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { key: 'city', label: 'City', placeholder: 'Mumbai' },
                { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                { key: 'pincode', label: 'PIN Code', placeholder: '400001' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                  <input
                    type="text"
                    value={profile[key]}
                    onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <><Spinner size="sm" /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <div className="card p-6">
          <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-500" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
            {[
              { key: 'currentPassword', label: 'Current Password' },
              { key: 'newPassword', label: 'New Password' },
              { key: 'confirmPassword', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="input-field"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <><Spinner size="sm" /> Updating...</> : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
