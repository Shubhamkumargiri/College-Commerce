import { useEffect, useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import api from '../lib/api';
import { toArray } from '../lib/collections';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?sort=popular')
      .then(({ data }) => setProducts(toArray(data)))
      .catch((error) => console.error(error));
  }, []);

  const featured = toArray(products).slice(0, 4);
  return (
    <div className="space-y-16 pb-14">
      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 px-6 py-14 text-white shadow-[0_30px_120px_rgba(15,23,42,0.4)] sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.34),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.26),_transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-emerald-200">
              Sustainable student marketplace
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Buy smart, sell faster, and share campus resources beautifully.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              CommerceHub helps students buy, sell, rent, and offer freelance services in one polished platform built for campus life.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-100">
                Explore marketplace
                <ArrowRight size={18} />
              </Link>
              <Link to="/add-listing" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Add your listing
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { icon: Compass, title: 'Nearby items', text: 'Spot listings around your campus blocks and library zones.' },
              { icon: ShieldCheck, title: 'Trusted community', text: 'Student-first profiles, reviews, and admin moderation.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
                <item.icon className="text-emerald-300" size={24} />
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'Reuse first', value: '200+', text: 'Items kept in circulation across campus communities.' },
          { label: 'Services listed', value: '35+', text: 'Student creators and freelancers offering work.' },
          { label: 'Faster response', value: '< 5m', text: 'Quick coordination helps students close deals faster.' },
        ].map((item) => (
          <div key={item.label} className="rounded-[30px] border border-slate-200 bg-white/85 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{item.value}</p>
            <p className="mt-3 text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section>
        <SectionTitle
          eyebrow="Featured"
          title="Popular campus picks"
          description="Handpicked listings, freelance services, and rentals trending with students."
          action={<Link to="/products" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">See all listings</Link>}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[36px] border border-slate-200 bg-white/85 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <SectionTitle
            eyebrow="Local Exchange"
            title="Meet safely and trade easily"
            description="Use familiar campus spots, confirm item details in chat, and choose a pickup time that works for both sides."
          />
          <div className="space-y-4">
            {[
              {
                title: 'Pick a public location',
                text: 'Arrange exchanges in well-known places like the library entrance, student center, or department block.',
              },
              {
                title: 'Confirm before you go',
                text: 'Verify price, condition, and timing early so both sides arrive prepared.',
              },
              {
                title: 'Keep it quick',
                text: 'Short, on-campus meetups help students close deals faster and with less hassle.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-slate-100 p-5 transition hover:border-emerald-200 hover:bg-emerald-50">
                <p className="text-lg font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-amber-200 bg-gradient-to-br from-amber-100 via-orange-50 to-white p-8 shadow-[0_20px_70px_rgba(245,158,11,0.18)]">
          <SectionTitle
            eyebrow="Smart Spending"
            title="Save more on everyday student needs"
            description="Compare listings, watch for fair pricing, and find affordable options for study, hostel, and campus life."
          />
          <div className="space-y-4">
            {[
              'Find second-hand books, devices, and room essentials at student-friendly prices.',
              'Check both sale and rental listings before buying something you only need for a short time.',
              'Ask questions early so you can compare value, condition, and pickup convenience with confidence.',
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 rounded-[24px] bg-white/70 p-5 backdrop-blur">
                <Sparkles className="mt-1 shrink-0 text-amber-500" size={18} />
                <p className="text-sm leading-6 text-slate-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
