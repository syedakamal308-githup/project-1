import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useMemo } from 'react';

export default function Hero() {
  const beans = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 24,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
      })),
    [],
  );

  const crumbs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        top: 20 + Math.random() * 50,
        size: 6 + Math.random() * 14,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 5,
      })),
    [],
  );

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-choco-950 pt-28">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover object-center"
        >
          <source src="/melting_coca.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-choco-950/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-choco-950/55 via-transparent to-choco-950/85" />
      <div className="absolute inset-0 bg-choco-radial" />

      {/* Floating cocoa beans */}
      {beans.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: `${b.left}%`, bottom: '-10%' }}
          animate={{
            y: [0, -110 - Math.random() * 40],
            x: [0, b.drift, 0],
            rotate: [0, 360],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <CocoaBean size={b.size} />
        </motion.div>
      ))}

      {/* Flying chocolate crumbs */}
      {crumbs.map((c) => (
        <motion.div
          key={c.id}
          className="absolute rounded-[3px] bg-gradient-to-br from-choco-600 to-choco-800"
          style={{ left: `${c.left}%`, top: `${c.top}%`, width: c.size, height: c.size }}
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Chocolate river at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-choco-950 via-choco-800/80 to-transparent" />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 h-24 w-[200%] rounded-[50%]"
            style={{
              left: '-50%',
              background: `radial-gradient(ellipse at center, rgba(109,76,65,0.5), transparent 70%)`,
            }}
            animate={{ x: ['0%', '-25%', '0%'] }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container-luxe relative z-10 grid items-center gap-12 pb-32 pt-16 lg:grid-cols-2 lg:pt-24">
        <div className="text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="eyebrow justify-center lg:justify-start"
          >
            <Sparkles className="h-4 w-4" />
            Crafted with Love Since 1998
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-5 font-display text-4xl font-bold leading-[1.1] text-cream-100 sm:text-6xl lg:text-7xl"
          >
            Premium Chocolates
            <br />
            <span className="text-gradient-gold">Crafted for</span>
            <br />
            Every Moment
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mx-auto mt-6 max-w-md text-base text-cream-100/70 sm:text-lg lg:mx-0"
          >
            Discover delicious flavors made with the finest ingredients —
            from silky rose to crunchy hazelnut, every bite is pure happiness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <a href="#collection" className="btn-gold animate-pulse-gold">
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#collection" className="btn-ghost border-cream-100/30 text-cream-100 hover:bg-cream-100 hover:text-choco-900">
              Explore Flavors
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-6 lg:justify-start"
          >
            <div className="flex -space-x-3">
              {['415829', '220453', '1239291', '762020'].map((id) => (
                <img
                  key={id}
                  src={`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=80`}
                  alt="Customer"
                  className="h-10 w-10 rounded-full border-2 border-choco-900 object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-gold-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-xs text-cream-100/60">
                Loved by <span className="font-semibold text-cream-100">12,000+</span> chocolate lovers
              </p>
            </div>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
        >
          {/* glow */}
          <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-3xl" />

          {/* rotating gold ring */}
          <motion.div
            className="absolute inset-4 rounded-full border border-dashed border-gold-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />

          {/* main chocolate image */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-8 overflow-hidden rounded-[2.5rem] shadow-choco ring-1 ring-gold-400/20"
          >
            <img
              src="https://images.pexels.com/photos/1319330/pexels-photo-1319330.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Premium Moggy Chocolate"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-choco-950/60 via-transparent to-transparent" />
          </motion.div>

          {/* floating flavor badges */}
          {[
            { label: 'Rose', color: 'bg-berry', top: '8%', left: '-6%' },
            { label: 'Hazelnut', color: 'bg-amber-700', top: '70%', left: '-10%' },
            { label: 'Pistachio', color: 'bg-pistachio', top: '40%', right: '-12%' },
            { label: 'Coffee', color: 'bg-coffee', bottom: '-4%', right: '10%' },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              className={`absolute flex items-center gap-1.5 rounded-full ${b.color} px-3 py-1.5 text-xs font-semibold text-white shadow-soft`}
              style={{ top: b.top, left: b.left, right: b.right, bottom: b.bottom }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              {b.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-cream-100/50"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mx-auto flex h-9 w-5 justify-center rounded-full border border-cream-100/30 pt-1.5"
        >
          <div className="h-1.5 w-1 rounded-full bg-gold-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function CocoaBean({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="6" ry="9" fill="#6D4C41" opacity="0.7" />
      <path d="M12 3 Q12 12 12 21" stroke="#3B2418" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}
