import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart } from 'lucide-react';
import { products } from '@/data/products';
import { useShop } from '@/context/ShopContext';

const featured = products.filter((p) => p.badge === 'Premium' || p.badge === 'Bestseller').slice(0, 6);

export default function FeaturedSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % featured.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + featured.length) % featured.length);
  };

  const product = featured[index];
  const Icon = product.icon;

  return (
    <section className="relative overflow-hidden bg-cream-100 py-24">
      <div className="absolute inset-0 bg-choco-radial opacity-40" />
      <div className="container-luxe relative">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow justify-center"
          >
            Featured Products
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-choco-800 sm:text-5xl"
          >
            Most <span className="text-gradient-gold">Loved</span> Chocolates
          </motion.h2>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* 3D rotating visual */}
          <div className="perspective relative mx-auto h-80 w-80 sm:h-96 sm:w-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, rotateY: direction * 90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: direction * -90, scale: 0.8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="preserve-3d relative h-full w-full"
              >
                <div className={`relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${product.wrapper} shadow-choco`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/25" />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply"
                  />
                  <div className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-choco-800 shadow-soft">
                    <Icon className="h-7 w-7" />
                  </div>
                  {product.badge && (
                    <div className="absolute right-6 top-6 rounded-full bg-choco-900/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300">
                      {product.badge}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* floating glow */}
            <div className="absolute -inset-4 -z-10 rounded-full bg-gold-400/20 blur-3xl" />
          </div>

          {/* Details */}
          <div className="text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 lg:justify-start">
                  <div className="flex items-center gap-0.5 text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-choco-500">{product.reviews} reviews</span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold text-choco-800 sm:text-4xl">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gold-600">
                  {product.flavor}
                </p>
                <p className="mx-auto mt-4 max-w-md text-choco-600 lg:mx-0">
                  {product.description}
                </p>
                <div className="mt-6 flex items-center justify-center gap-6 lg:justify-start">
                  <span className="font-display text-4xl font-bold text-choco-800">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(product)}
                      className="btn-gold"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Wishlist"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-choco-800/20 text-choco-700 transition-all hover:border-berry hover:text-berry active:scale-90"
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-berry text-berry' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-choco-800/20 text-choco-700 transition-all hover:bg-choco-800 hover:text-cream-100 active:scale-90"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? 'w-8 bg-gold-400' : 'w-2 bg-choco-300'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-choco-800/20 text-choco-700 transition-all hover:bg-choco-800 hover:text-cream-100 active:scale-90"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
