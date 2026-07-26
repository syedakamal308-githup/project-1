import { motion } from 'framer-motion';
import { Leaf, Award, Globe2, Heart } from 'lucide-react';

const STATS = [
  { icon: Leaf, value: '100%', label: 'Natural Cocoa' },
  { icon: Award, value: '25+', label: 'Years of Craft' },
  { icon: Globe2, value: '40+', label: 'Countries Served' },
  { icon: Heart, value: '12k+', label: 'Happy Customers' },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream-100 py-24">
      <div className="absolute inset-0 bg-grain opacity-[0.04]" />
      <div className="container-luxe relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Factory image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gold-400/15 blur-2xl" />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-[2rem] shadow-choco"
            >
              <img
                src="https://images.pexels.com/photos/1319340/pexels-photo-1319340.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Moggy Chocolate atelier"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-choco-950/50 to-transparent" />
            </motion.div>

            {/* floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-choco ring-1 ring-gold-400/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-choco-900">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-choco-800">Award Winning</div>
                <div className="text-xs text-choco-500">International Chocolate Awards</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Story */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow"
            >
              About Moggy
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 font-display text-3xl font-bold text-choco-800 sm:text-5xl"
            >
              A Story of <span className="text-gradient-gold">Cocoa & Craft</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5 leading-relaxed text-choco-600"
            >
              Moggy Chocolate creates premium chocolates using carefully selected
              cocoa beans and exceptional craftsmanship. Every flavor is designed to
              bring joy to people of all ages, making every celebration and everyday
              moment sweeter.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 leading-relaxed text-choco-600"
            >
              From our atelier to your hands, each bar is a small work of art —
              crafted with love, wrapped with care, and made to be shared.
            </motion.p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <s.icon className="mx-auto h-6 w-6 text-gold-500" />
                  <div className="mt-2 font-display text-2xl font-bold text-choco-800">{s.value}</div>
                  <div className="text-xs text-choco-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
