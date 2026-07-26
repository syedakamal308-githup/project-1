import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const SLOGAN_WORDS = ['Crafted', 'with', 'Passion.', 'Shared', 'with', 'the', 'World.'];

export default function BrandVideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setPaused(!paused);
    }
  };

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ minHeight: '85vh' }}>
      {/* Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="/moggy_brand.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-choco-950/80 via-choco-950/40 to-choco-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-choco-950/60 via-transparent to-choco-950/60" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,15,8,0.7) 100%)',
          }}
        />
      </div>

      {/* Floating cocoa particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-gold-300/20"
          style={{
            width: 6 + i * 3,
            height: 6 + i * 3,
            left: `${10 + i * 11}%`,
            bottom: '-20px',
          }}
          animate={{ y: [0, -(300 + i * 40)], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 8 + i * 1.5,
            delay: i * 1.2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-3"
        >
          <div className="h-px w-12 bg-gold-400/60" />
          <span className="eyebrow text-gold-300">The Moggy Experience</span>
          <div className="h-px w-12 bg-gold-400/60" />
        </motion.div>

        {/* Animated slogan */}
        <h2 className="font-display text-4xl font-bold leading-tight text-cream-100 sm:text-5xl md:text-6xl lg:text-7xl">
          {SLOGAN_WORDS.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`mr-3 inline-block ${
                word === 'Passion.' || word === 'World.'
                  ? 'text-gradient-gold'
                  : 'text-cream-100'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mt-6 max-w-xl text-lg text-cream-100/70"
        >
          From single-origin cocoa farms to luxury gift boxes — every Moggy chocolate
          tells a story of craftsmanship and care.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#collection" className="btn-gold">
            Shop the Collection
          </a>
          <a href="#about" className="btn-ghost">
            Our Story
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 2.0 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: '13+', label: 'Signature Flavors' },
            { value: '100%', label: 'Natural Ingredients' },
            { value: '50+', label: 'Countries Shipped' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-gold">{stat.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-cream-100/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Video controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-label={paused ? 'Play' : 'Pause'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-choco-900/70 text-cream-100 backdrop-blur-sm transition-all hover:bg-choco-800/80 hover:text-gold-300"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-choco-900/70 text-cream-100 backdrop-blur-sm transition-all hover:bg-choco-800/80 hover:text-gold-300"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="h-8 w-5 rounded-full border border-gold-400/40 p-1">
            <motion.div
              className="mx-auto h-1.5 w-1.5 rounded-full bg-gold-400"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
