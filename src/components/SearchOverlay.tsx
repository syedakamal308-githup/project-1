import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { products, sugarFreeProducts } from '@/data/products';

const all = [...products, ...sugarFreeProducts];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.flavor.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-[80] bg-choco-950/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-1/2 top-24 z-[90] w-[92%] max-w-2xl -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-3xl bg-cream-100 shadow-choco ring-1 ring-choco-800/10">
              <div className="flex items-center gap-3 border-b border-choco-800/10 px-5 py-4">
                <Search className="h-5 w-5 text-choco-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search flavors, chocolates..."
                  className="flex-1 bg-transparent text-choco-800 outline-none placeholder-choco-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-choco-500 transition-colors hover:bg-choco-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-3">
                {query.trim() === '' ? (
                  <p className="px-4 py-8 text-center text-sm text-choco-500">
                    Start typing to search our chocolate collection...
                  </p>
                ) : results.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-choco-500">
                    No chocolates found for "{query}". Try another flavor.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {results.map((p) => (
                      <li key={p.id}>
                        <a
                          href="#collection"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-choco-100"
                        >
                          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${p.wrapper} text-white`}>
                            <p.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-choco-800">{p.name}</div>
                            <div className="text-xs text-choco-500">{p.flavor}</div>
                          </div>
                          <span className="font-display text-sm font-bold text-choco-700">${p.price.toFixed(2)}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
