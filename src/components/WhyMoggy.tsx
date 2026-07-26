import { motion } from 'framer-motion';
import { features } from '@/data/products';

export default function WhyMoggy() {
  return (
    <section className="relative overflow-hidden bg-cream-100 py-24">
      <div className="absolute inset-0 bg-grain opacity-[0.04]" />
      <div className="container-luxe relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow justify-center"
          >
            Why Moggy Chocolate
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-choco-800 sm:text-5xl"
          >
            Six Reasons to{' '}
            <span className="text-gradient-gold">Fall in Love</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-choco-600"
          >
            Every Moggy chocolate is a small celebration — crafted with intention,
            wrapped with care, and made to bring joy.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group card-luxe relative p-8"
            >
              <div className="absolute right-6 top-6 text-6xl font-display font-bold text-choco-800/5 transition-colors group-hover:text-gold-400/10">
                {String(i + 1).padStart(2, '0')}
              </div>
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-choco-700 to-choco-900 text-gold-300 shadow-soft"
              >
                <f.icon className="h-7 w-7" />
              </motion.div>
              <h3 className="mt-5 font-display text-xl font-bold text-choco-800">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-choco-600">
                {f.text}
              </p>
              <div className="mt-5 h-px w-0 bg-gradient-to-r from-gold-400 to-transparent transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
