import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import api from '../lib/api';

const initialFilters = {
  keyword: '',
  category: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  sort: 'popular',
};

function readFilters(searchParams) {
  return {
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'popular',
  };
}

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== '')
    ).toString();

    api.get(`/products?${params}`)
      .then(({ data }) => setProducts(data))
      .catch((error) => console.error(error));

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const categories = useMemo(() => ['Books', 'Electronics', 'Furniture', 'Services', 'Stationery', 'Other'], []);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)]">
        <SectionTitle eyebrow="Filters" title="Find your fit" description="Search smarter across campus categories." />
        <div className="space-y-4">
          <input className="input-field" placeholder="Search by keyword" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
          <select className="input-field" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select className="input-field" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All listing types</option>
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
            <option value="service">Service</option>
            <option value="buy">Buy</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field" type="number" placeholder="Min Rs." value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
            <input className="input-field" type="number" placeholder="Max Rs." value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
          <select className="input-field" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="popular">Popular</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="titleAsc">Title A-Z</option>
          </select>
          <button className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={() => setFilters(initialFilters)}>
            Reset filters
          </button>
        </div>
      </aside>

      <section>
        <SectionTitle
          eyebrow="Marketplace"
          title="Shop listings, rentals, and services"
          description={`Showing ${products.length} active opportunities across the campus community.`}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
