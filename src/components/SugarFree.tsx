import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, HeartPulse } from 'lucide-react';
import { sugarFreeProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function SugarFree() {
  return (
    <section id="sugarfree" className="relative overflow-hidden bg-choco-900 py-24">
      {/* dark chocolate with cocoa beans on wooden log background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/37062650/pexels-photo-37062650.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-choco-950/40 via-choco-900/30 to-choco-950/50" />
      <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />

      {Array.from({ length: 30 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      <div className="container-luxe relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow justify-start text-gold-400"
            >
              <Leaf className="h-4 w-4" />
              Sugar-Free Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-3xl font-bold text-cream-100 sm:text-5xl"
            >
              Healthy Chocolate
              <br />
              <span className="text-gradient-gold">Without Compromise</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-cream-100/70"
            >
              All the indulgence, none of the guilt. Our sugar-free range is
              naturally sweetened with stevia and crafted to deliver the same
              rich Moggy flavor you love — with zero added sugar.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, label: 'No Added Sugar' },
                { icon: HeartPulse, label: 'Naturally Sweetened' },
                { icon: Leaf, label: 'Keto Friendly' },
              ].map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-2 text-sm font-medium text-cream-100/90 backdrop-blur-sm"
                >
                  <b.icon className="h-4 w-4 text-gold-300" />
                  {b.label}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="relative h-40 w-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-gold-400/40"
              />
              <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-glow-gold">
                <span className="text-center font-display text-3xl font-bold text-choco-900">
                  0g
                  <span className="block text-xs font-semibold uppercase tracking-wider">Sugar</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sugarFreeProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
