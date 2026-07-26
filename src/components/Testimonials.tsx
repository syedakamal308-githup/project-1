import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/products';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  const t = testimonials[index];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-cream-50 py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-choco-radial opacity-40" />
      <div className="container-luxe relative">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow justify-center"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-choco-800 sm:text-5xl"
          >
            What Our <span className="text-gradient-gold">Chocolate Lovers</span> Say
          </motion.h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative card-luxe p-10 text-center sm:p-14"
            >
              <Quote className="mx-auto h-12 w-12 text-gold-400/40" />
              <div className="mt-6 flex items-center justify-center gap-1 text-gold-500">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mx-auto mt-6 max-w-2xl font-display text-xl italic leading-relaxed text-choco-700 sm:text-2xl">
                "{t.text}"
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <motion.img
                  src={t.avatar}
                  alt={t.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-gold-400/40"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="text-left">
                  <div className="font-display text-lg font-bold text-choco-800">{t.name}</div>
                  <div className="text-sm text-gold-600">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-choco-800/20 text-choco-700 transition-all hover:bg-choco-800 hover:text-cream-100 active:scale-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
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
    </section>
  );
}
