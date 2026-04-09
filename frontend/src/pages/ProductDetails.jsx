import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, ShoppingBag, Star } from 'lucide-react';
import api from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch((error) => console.error(error));
  }, [id]);

  async function createOrder() {
    try {
      await api.post('/orders', { productId: product._id, agreedPrice: product.price });
      alert('Order request placed successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to place order');
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        seller: product.seller._id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to submit review');
    }
  }

  if (!product) {
    return <div className="rounded-[32px] bg-white/80 p-10 text-center text-slate-500">Loading listing details...</div>;
  }

  const isOwner = user?._id === product.seller?._id;
  const imageSrc = product.images?.[0] || 'https://via.placeholder.com/1200x800?text=No+Image';

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.09)]">
          <img src={imageSrc} alt={product.title} className="h-[420px] w-full object-cover" />
        </div>
        <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">{product.category}</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">{product.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium uppercase">{product.type}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={16} /> {product.location}, {product.campus}</span>
            <span className="inline-flex items-center gap-1"><Star size={16} className="fill-amber-400 text-amber-400" /> {product.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
          <p className="mt-6 text-lg leading-8 text-slate-600">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(product.tags || []).map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">#{tag}</span>)}
          </div>
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-semibold text-slate-950">Seller reviews</h2>
          <div className="mt-6 space-y-4">
            {product.reviews?.length ? product.reviews.map((review) => (
              <div key={review._id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                  <ProfileAvatar user={review.reviewer} size={44} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-950">{review.reviewer?.name}</p>
                    <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">{review.comment}</p>
              </div>
            )) : <p className="text-slate-500">No reviews yet.</p>}
          </div>

          {user && !isOwner ? (
            <form onSubmit={submitReview} className="mt-8 space-y-4 rounded-[28px] border border-slate-100 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-950">Leave a review</h3>
              <select className="input-field" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
              </select>
              <textarea className="input-field min-h-28" placeholder="Share your experience" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
              <button className="rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">Submit review</button>
            </form>
          ) : null}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-4xl font-semibold text-slate-950">{formatCurrency(product.price)}</p>
          {product.originalPrice ? <p className="mt-2 text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p> : null}
          <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
            <div className="flex items-center gap-4">
              <ProfileAvatar user={product.seller} size={56} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
              <div>
                <p className="font-semibold text-slate-950">{product.seller?.name}</p>
                <p className="text-sm text-slate-500">{product.seller?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {user ? (
              !isOwner ? (
              <>
                <button onClick={createOrder} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
                  <ShoppingBag size={18} />
                  Place order
                </button>
                <Link to={`/chat/${product.seller?._id}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
                  Chat with seller
                </Link>
              </>
              ) : (
              <Link to={`/add-listing?edit=${product._id}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
                Edit your listing
              </Link>
              )
            ) : (
              <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">
                Login to continue
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
