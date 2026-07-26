import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { products, sugarFreeProducts } from '@/data/products';

const allProducts = [...products, ...sugarFreeProducts, {
  id: 'gift-basket',
  name: 'Premium Gift Basket',
  shortName: 'Gift Basket',
  collection: 'signature' as const,
  flavor: 'Assorted Collection',
  description: 'Handcrafted wooden basket with assorted Moggy chocolates.',
  price: 49,
  wrapper: 'from-gold-300 to-gold-500',
  wrapperSolid: '#D4AF37',
  icon: Heart,
  rating: 5,
  reviews: 128,
  image: 'https://images.pexels.com/photos/1319350/pexels-photo-1319350.jpeg?auto=compress&cs=tinysrgb&w=900',
}];

export default function WishlistDrawer() {
  const { isWishlistOpen, closeWishlist, wishlist, toggleWishlist, addToCart } = useShop();

  const items = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 z-[60] bg-choco-950/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-cream-100 shadow-choco"
          >
            <div className="flex items-center justify-between border-b border-choco-800/10 bg-white px-6 py-5">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-berry" />
                <h2 className="font-display text-lg font-bold text-choco-800">
                  Wishlist <span className="text-choco-400">({items.length})</span>
                </h2>
              </div>
              <button
                onClick={closeWishlist}
                aria-label="Close wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-full text-choco-700 transition-colors hover:bg-choco-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-choco-100 text-choco-400">
                    <Heart className="h-8 w-8" />
                  </div>
                  <p className="mt-5 font-display text-lg font-bold text-choco-800">No favorites yet</p>
                  <p className="mt-1 text-sm text-choco-500">Tap the heart on any chocolate to save it here.</p>
                  <button onClick={closeWishlist} className="btn-gold mt-6">
                    Discover Chocolates
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((p) => (
                    <motion.li
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 rounded-2xl bg-white p-3 shadow-soft"
                    >
                      <div className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${p.wrapper}`}>
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover opacity-90 mix-blend-multiply" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display text-sm font-bold text-choco-800">{p.name}</h3>
                            <p className="text-xs text-gold-600">{p.flavor}</p>
                          </div>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            aria-label="Remove from wishlist"
                            className="text-choco-400 transition-colors hover:text-berry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-display text-base font-bold text-choco-800">${p.price.toFixed(2)}</span>
                          <button
                            onClick={() => addToCart(p)}
                            className="flex items-center gap-1.5 rounded-full bg-choco-800 px-3 py-1.5 text-xs font-semibold text-cream-100 transition-colors hover:bg-choco-700"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
