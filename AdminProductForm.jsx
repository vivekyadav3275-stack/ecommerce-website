import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, ArrowLeft, ImagePlus } from 'lucide-react';
import API from '../../utils/api';
import Spinner from '../../components/common/Spinner';
import AdminSidebar from '../../components/admin/AdminSidebar';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Grocery', 'Other'];

const INITIAL_FORM = {
  name: '', description: '', price: '', discountedPrice: '',
  category: 'Electronics', brand: '', stock: '', featured: false,
  tags: '', images: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          discountedPrice: p.discountedPrice || '',
          category: p.category || 'Electronics',
          brand: p.brand || '',
          stock: p.stock || '',
          featured: p.featured || false,
          tags: p.tags?.join(', ') || '',
          images: p.images || [],
        });
      } catch (err) {
        toast.error('Failed to load product');
        navigate('/admin/products');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (form.images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('images', f));

      const { data } = await API.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm((prev) => ({ ...prev, images: [...prev.images, ...data.images] }));
      toast.success(`${files.length} image(s) uploaded!`);
    } catch (err) {
      // If Cloudinary not configured, use a placeholder for demo
      const placeholders = files.map((_, i) => ({
        url: `https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&sig=${Date.now() + i}`,
        public_id: `demo_${Date.now() + i}`,
      }));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...placeholders] }));
      toast('Using placeholder images (Cloudinary not configured)', { icon: '⚠️' });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const img = form.images[index];
    if (img.public_id && !img.public_id.startsWith('demo_')) {
      try { await API.delete(`/upload/image/${encodeURIComponent(img.public_id)}`); }
      catch {}
    }
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Product name is required');
    if (!form.price || Number(form.price) <= 0) return toast.error('Valid price is required');
    if (!form.stock || Number(form.stock) < 0) return toast.error('Stock quantity is required');
    if (form.images.length === 0) return toast.error('At least one image is required');

    setLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      discountedPrice: Number(form.discountedPrice) || 0,
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      if (isEdit) {
        await API.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await API.post('/products', payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 flex justify-center items-center min-h-96"><Spinner size="lg" /></div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button onClick={() => navigate('/admin/products')} className="flex items-center gap-1.5 text-stone-500 hover:text-orange-500 text-sm mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Products
            </button>
            <h1 className="text-2xl font-bold text-stone-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-stone-800">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Product Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. iPhone 15 Pro Max" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Describe the product in detail..." required />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Brand</label>
                  <input type="text" name="brand" value={form.brand} onChange={handleChange} className="input-field" placeholder="e.g. Apple, Nike" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Tags (comma-separated)</label>
                <input type="text" name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="smartphone, apple, 5g" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-orange-500" />
                <label htmlFor="featured" className="text-sm font-medium text-stone-700 cursor-pointer">
                  ⭐ Mark as Featured Product
                </label>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-stone-800">Pricing & Inventory</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">MRP (₹) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" className="input-field" placeholder="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Sale Price (₹)</label>
                  <input type="number" name="discountedPrice" value={form.discountedPrice} onChange={handleChange} min="0" step="0.01" className="input-field" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Stock *</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" className="input-field" placeholder="0" required />
                </div>
              </div>
              {form.price && form.discountedPrice && Number(form.discountedPrice) < Number(form.price) && (
                <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg">
                  💰 Discount: {Math.round(((form.price - form.discountedPrice) / form.price) * 100)}% off
                </div>
              )}
            </div>

            {/* Images */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-stone-800">Product Images</h3>
              <p className="text-sm text-stone-500">Upload up to 5 images. First image is the main display image.</p>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-stone-200 group">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-md">Main</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {form.images.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-orange-400 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors hover:bg-orange-50">
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    {uploading ? <Spinner size="sm" /> : <><ImagePlus className="w-5 h-5 text-stone-400" /><span className="text-xs text-stone-400">Add</span></>}
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <><Spinner size="sm" /> {isEdit ? 'Updating...' : 'Creating...'}</> : <>{isEdit ? '✓ Update Product' : '+ Create Product'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
