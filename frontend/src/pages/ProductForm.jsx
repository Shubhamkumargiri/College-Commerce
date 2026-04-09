import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';

const initialState = {
  title: '',
  description: '',
  price: '',
  originalPrice: '',
  category: 'Books',
  customCategory: '',
  type: 'sell',
  images: [],
  campus: '',
  location: '',
  tags: '',
  isNearby: true,
};

export default function ProductForm() {
  const [formData, setFormData] = useState(initialState);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (!editId) return;

    api.get(`/products/${editId}`)
      .then(({ data }) =>
        setFormData({
          ...data,
          images: data.images || [],
          tags: data.tags?.join(', ') || '',
          category: ['Books', 'Electronics', 'Clothing', 'Furniture', 'Stationery', 'Services'].includes(data.category)
            ? data.category
            : 'Custom',
          customCategory: ['Books', 'Electronics', 'Clothing', 'Furniture', 'Stationery', 'Services'].includes(data.category)
            ? ''
            : data.category || '',
        })
      )
      .catch((error) => console.error(error));
  }, [editId]);

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const uploadData = new FormData();
    files.forEach((file) => uploadData.append('images', file));

    try {
      setIsUploadingImages(true);
      const { data } = await api.post('/products/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData((current) => ({
        ...current,
        images: [...current.images, ...(data.images || [])].slice(0, 5),
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to upload image');
    } finally {
      setIsUploadingImages(false);
      e.target.value = '';
    }
  }

  function removeImage(imageUrl) {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((item) => item !== imageUrl),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      category: formData.category === 'Custom' ? formData.customCategory.trim() : formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      images: formData.images,
      tags: formData.tags.split(',').map((item) => item.trim()).filter(Boolean),
    };

    if (!payload.category) {
      alert('Please enter a custom category');
      return;
    }

    try {
      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/products');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to save listing');
    }
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Add Listing</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">{editId ? 'Edit your listing' : 'Create a new listing'}</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <input className="input-field md:col-span-2" placeholder="Listing title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        <textarea className="input-field min-h-32 resize-none md:col-span-2" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        <input className="input-field" type="number" placeholder="Current price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        <input className="input-field" type="number" placeholder="Original price (optional)" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
        <select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
          {['Books', 'Electronics', 'Clothing', 'Furniture', 'Stationery', 'Services', 'Custom'].map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        {formData.category === 'Custom' ? (
          <input
            className="input-field md:col-span-2"
            placeholder="Write your own category"
            value={formData.customCategory}
            onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
            required
          />
        ) : null}
        <select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
          {['sell', 'rent', 'service', 'buy'].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input className="input-field" placeholder="Campus" value={formData.campus} onChange={(e) => setFormData({ ...formData, campus: e.target.value })} />
        <input className="input-field" placeholder="Pickup / service location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Listing images</p>
              <p className="mt-2 text-sm text-slate-500">Upload up to 5 images. JPG, PNG, and WebP files are supported.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              {isUploadingImages ? 'Uploading...' : 'Upload images'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploadingImages || formData.images.length >= 5} />
            </label>
          </div>

          {formData.images.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formData.images.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                  <img src={image} alt={`Listing preview ${index + 1}`} className="h-40 w-full object-cover" />
                  <div className="flex items-center justify-between gap-3 p-3">
                    <p className="truncate text-sm text-slate-500">Image {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No images uploaded yet.
            </div>
          )}
        </div>
        <input className="input-field md:col-span-2" placeholder="Tags, comma separated" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
        <label className="flex items-center gap-3 text-sm text-slate-600 md:col-span-2">
          <input type="checkbox" checked={formData.isNearby} onChange={(e) => setFormData({ ...formData, isNearby: e.target.checked })} />
          Mark as nearby item
        </label>
        <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2" disabled={isUploadingImages}>
          {editId ? 'Update listing' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
