import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { discountPercent, formatCurrency } from '../lib/utils';
import ProfileAvatar from './ProfileAvatar';

export default function ProductCard({ product }) {
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Link
      to={`/products/${product._id}`}
      className="group overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.14)]"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
            {product.type}
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={14} />
            {product.location}
          </span>
        </div>

        <div>
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-950">{product.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">{product.description}</p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-slate-950">{formatCurrency(product.price)}</p>
            {product.originalPrice ? (
              <p className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice)}</p>
            ) : null}
          </div>
          <div className="text-right text-xs text-slate-500">
            <div className="flex items-center justify-end gap-2">
              <p>{product.seller?.name || 'Campus seller'}</p>
              <ProfileAvatar user={product.seller} size={28} fallbackClassName="bg-gradient-to-br from-slate-950 to-emerald-600" />
            </div>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              Trusted
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
