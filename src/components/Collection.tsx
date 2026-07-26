import { motion } from 'framer-motion';
import { useState } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const FILTERS = ['All', 'Bestseller', 'Premium'] as const;
type Filter = (typeof FILTERS)[number];

export default function Collection() {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = products.filter((p) => {
    if (filter === 'All') return true;
    return p.badge === filter;
  });

  return (
    <section id="collection" className="relative overflow-hidden bg-cream-50 py-24">
      <div className="absolute inset-0 bg-choco-radial opacity-50" />
      <div className="container-luxe relative">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow justify-center"
          >
            Our Chocolates
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-choco-800 sm:text-5xl"
          >
            The Complete <span className="text-gradient-gold">Moggy Collection</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-xl text-choco-600"
          >
            Thirteen signature flavors, each wrapped in its own world of color.
            Find your favorite — or collect them all.
          </motion.p>

          {/* Filter pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  filter === f ? 'text-cream-100' : 'text-choco-700 hover:text-choco-900'
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-choco-800"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
