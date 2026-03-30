import { useState, useEffect, useCallback } from 'react';
import { Search, Shield, ShieldOff, Trash2 } from 'lucide-react';
import API from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionId, setActionId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      const { data } = await API.get('/admin/users', { params });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleRole = async (userId, currentRole) => {
    if (userId === currentUser._id) return toast.error("Can't change your own role");
    setActionId(userId);
    try {
      await API.put(`/admin/users/${userId}`, { role: currentRole === 'admin' ? 'user' : 'admin' });
      toast.success('User role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    } finally {
      setActionId(null);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    if (userId === currentUser._id) return toast.error("Can't deactivate yourself");
    setActionId(userId);
    try {
      await API.put(`/admin/users/${userId}`, { isActive: !isActive });
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (userId, name) => {
    if (userId === currentUser._id) return toast.error("Can't delete yourself");
    if (!window.confirm(`Delete user "${name}"?`)) return;
    setActionId(userId);
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900">Users</h1>
            <p className="text-stone-500 text-sm mt-1">Manage customer accounts and permissions</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="input-field pl-10 max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-orange-600 text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-stone-800">
                                {user.name}
                                {user._id === currentUser._id && (
                                  <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">You</span>
                                )}
                              </p>
                              <p className="text-xs text-stone-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>
                            {user.role === 'admin' ? '🔑 Admin' : '👤 User'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-stone-500">{formatDate(user.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          {actionId === user._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleRole(user._id, user.role)}
                                disabled={user._id === currentUser._id}
                                title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                className="p-1.5 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-30"
                              >
                                {user.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDelete(user._id, user.name)}
                                disabled={user._id === currentUser._id}
                                title="Delete User"
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
