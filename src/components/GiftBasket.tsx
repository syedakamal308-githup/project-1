import { motion } from 'framer-motion';
import { Gift, ShoppingBag, Sparkles, Flower2, Mail, Ribbon } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const INCLUDED = [
  { icon: Gift, label: 'Premium wooden basket' },
  { icon: Ribbon, label: 'Luxury ribbon wrapping' },
  { icon: Sparkles, label: 'Mixed Moggy chocolates' },
  { icon: Mail, label: 'Personalized greeting card' },
  { icon: Flower2, label: 'Fresh flowers' },
  { icon: Gift, label: 'Chocolate bouquet & luxury box' },
];

const PACKAGING_STYLES = [
  {
    id: 'p1',
    src: 'https://images.pexels.com/photos/13278153/pexels-photo-13278153.jpeg?auto=compress&cs=tinysrgb&w=600',
    label: 'Classic Assortment Box',
    desc: 'Gourmet pralines in an elegant presentation box',
  },
  {
    id: 'p2',
    src: 'https://images.pexels.com/photos/14275692/pexels-photo-14275692.jpeg?auto=compress&cs=tinysrgb&w=600',
    label: 'Black Ribbon Box',
    desc: 'Colorful pralines with a signature orange ribbon',
  },
  {
    id: 'p3',
    src: 'https://images.pexels.com/photos/13831901/pexels-photo-13831901.jpeg?auto=compress&cs=tinysrgb&w=600',
    label: 'Floral Gift Set',
    desc: 'Chocolates paired with a fresh flower bouquet',
  },
  {
    id: 'p4',
    src: 'https://images.pexels.com/photos/14275580/pexels-photo-14275580.jpeg?auto=compress&cs=tinysrgb&w=600',
    label: 'Thank You Box',
    desc: 'Pralines with a personalized greeting card',
  },
  {
    id: 'p5',
    src: 'https://images.pexels.com/photos/17542166/pexels-photo-17542166.jpeg?auto=compress&cs=tinysrgb&w=600',
    label: 'Floral Wrap Box',
    desc: 'Beautifully packaged with floral decorations',
  },
  {
    id: 'p6',
    src: 'https://images.pexels.com/photos/30353752/pexels-photo-30353752.jpeg?auto=compress&cs=tinysrgb&w=600',
    label: 'Twine-Tied Box',
    desc: 'Artisan truffles tied with rustic twine',
  },
];

const MAIN_IMAGE =
  'https://images.pexels.com/photos/13278153/pexels-photo-13278153.jpeg?auto=compress&cs=tinysrgb&w=900';

export default function GiftBasket() {
  const { addToCart } = useShop();

  return (
    <section id="gift" className="relative overflow-hidden bg-gradient-to-br from-choco-800 via-choco-900 to-choco-950 py-24">
      {/* golden sparkles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 0], y: [0, -20, 0] }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="container-luxe relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-6 rounded-full bg-gold-400/20 blur-3xl" />
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative overflow-hidden rounded-[2.5rem] shadow-choco ring-1 ring-gold-400/30"
            >
              <img
                src={MAIN_IMAGE}
                alt="Premium Moggy gift basket with assorted chocolates"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-choco-950/70 via-transparent to-transparent" />
            </motion.div>

            {/* price tag */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: -8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute -right-4 top-8 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-choco-900 shadow-glow-gold"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider">From</span>
              <span className="font-display text-2xl font-bold">$49</span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow"
            >
              <Gift className="h-4 w-4" />
              Premium Gift Basket
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-3xl font-bold text-cream-100 sm:text-5xl"
            >
              The Ultimate{' '}
              <span className="text-gradient-gold">Chocolate Gift</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-md text-cream-100/70"
            >
              A handcrafted wooden basket overflowing with our finest chocolates,
              fresh flowers, and a personalized card — wrapped in luxury ribbon.
              The perfect gift for every celebration.
            </motion.p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {INCLUDED.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-cream-100/90"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-300">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <button className="btn-gold">
                <Sparkles className="h-4 w-4" />
                Customize Basket
              </button>
              <button
                onClick={() =>
                  addToCart({
                    id: 'gift-basket',
                    name: 'Premium Gift Basket',
                    shortName: 'Gift Basket',
                    collection: 'signature',
                    flavor: 'Assorted Collection',
                    description: 'Handcrafted wooden basket with assorted Moggy chocolates, flowers, and a personalized card.',
                    price: 49,
                    badge: 'Luxury',
                    wrapper: 'from-gold-300 to-gold-500',
                    wrapperSolid: '#D4AF37',
                    icon: Gift,
                    rating: 5,
                    reviews: 128,
                    image: MAIN_IMAGE,
                  })
                }
                className="btn-cream"
              >
                <ShoppingBag className="h-4 w-4" />
                Order Now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Gift Packaging Gallery */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <span className="eyebrow justify-center">
              <Ribbon className="h-4 w-4" />
              Choose Your Packaging
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-cream-100 sm:text-3xl">
              6 Beautiful Gift Packaging Styles
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-cream-100/60">
              Every Moggy gift is wrapped to impress. Select your favorite style and
              we'll craft your basket with meticulous attention to detail.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {PACKAGING_STYLES.map((style, i) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl ring-1 ring-gold-400/20 transition-shadow hover:shadow-glow-gold"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={style.src}
                    alt={style.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-choco-950 via-choco-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-display text-sm font-semibold text-gold-300">
                    {style.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-cream-100/70">
                    {style.desc}
                  </p>
                </div>
                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold-400/20 text-gold-300 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
