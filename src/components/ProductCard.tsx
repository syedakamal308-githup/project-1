import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Plus } from 'lucide-react';
import type { Product } from '@/data/products';
import { useShop } from '@/context/ShopContext';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const fav = isInWishlist(product.id);
  const Icon = product.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -10 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-choco-800/5"
    >
      {/* Wrapper / image area */}
      <div className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${product.wrapper}`}>
        {/* wrapper sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/25" />
        <div className="absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />

        {/* wrapper stripes */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />

        {/* chocolate image */}
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6 }}
        />

        {/* flavor icon badge */}
        <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-choco-800 shadow-soft backdrop-blur-sm">
          <Icon className="h-5 w-5" />
        </div>

        {/* badge */}
        {product.badge && (
          <div className="absolute right-4 top-4 rounded-full bg-choco-900/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur-sm">
            {product.badge}
          </div>
        )}

        {/* wishlist button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="Add to wishlist"
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-choco-800 shadow-soft backdrop-blur-sm transition-all hover:scale-110 active:scale-90"
        >
          <Heart className={`h-5 w-5 transition-colors ${fav ? 'fill-berry text-berry' : 'text-choco-800'}`} />
        </button>

        {/* quick add (appears on hover) */}
        <motion.div
          initial={false}
          className="absolute inset-x-4 bottom-4 translate-y-16 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <button
            onClick={() => addToCart(product)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-choco-900/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-cream-100 backdrop-blur-sm transition-colors hover:bg-choco-800"
          >
            <Plus className="h-4 w-4" /> Quick Add
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-choco-800">{product.name}</h3>
            <p className="text-xs font-medium uppercase tracking-wider text-gold-600">{product.flavor}</p>
          </div>
          <div className="flex items-center gap-1 text-gold-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="text-xs font-semibold text-choco-700">{product.rating}</span>
          </div>
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-choco-600">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-choco-800">${product.price.toFixed(2)}</span>
            <span className="text-xs text-choco-400">/ bar</span>
          </div>
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-choco-900 shadow-soft transition-all hover:scale-110 hover:shadow-glow-gold active:scale-90"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
