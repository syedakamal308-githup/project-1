import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import CrownedLogo from '@/components/CrownedLogo';

interface IntroLoaderProps {
  onComplete: () => void;
}

interface Shard {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  size: number;
}

interface Dust {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const TAGLINE = 'Every Bite, Pure Happiness.';

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [stage, setStage] = useState<'logo' | 'fall' | 'break' | 'fade' | 'done'>('logo');

  const shards = useMemo<Shard[]>(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.2) * 500,
        rotate: Math.random() * 720 - 360,
        scale: 0.4 + Math.random() * 0.9,
        delay: Math.random() * 0.18,
        size: 18 + Math.random() * 34,
      })),
    [],
  );

  const dust = useMemo<Dust[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.5) * 400,
        size: 4 + Math.random() * 14,
        delay: Math.random() * 0.3,
        duration: 1 + Math.random() * 1.2,
      })),
    [],
  );

  useEffect(() => {
    const t1 = setTimeout(() => setStage('fall'), 1600);
    const t2 = setTimeout(() => setStage('break'), 2600);
    const t3 = setTimeout(() => setStage('fade'), 3600);
    const t4 = setTimeout(() => onComplete(), 4400);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-choco-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* ambient glow */}
          <motion.div
            className="absolute h-[60vmax] w-[60vmax] rounded-full bg-gold-400/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* rising smoke wisps */}
          {['smoke1', 'smoke2', 'smoke3'].map((s, i) => (
            <motion.div
              key={s}
              className="absolute bottom-1/3 h-40 w-40 rounded-full bg-gold-200/20 blur-2xl"
              style={{ left: `${30 + i * 18}%` }}
              animate={{ y: [0, -180], opacity: [0, 0.6, 0], scale: [0.5, 2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
            />
          ))}

          {/* Logo */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: stage === 'fade' ? 0 : 1,
              y: stage === 'fall' ? -10 : 0,
              scale: stage === 'fall' ? 0.92 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Crowned logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4"
            >
              <CrownedLogo size={88} animate />
            </motion.div>
            <motion.div
              className="font-display text-5xl font-bold tracking-tight text-cream-100 sm:text-7xl"
              initial={{ letterSpacing: '0.5em', opacity: 0 }}
              animate={{ letterSpacing: '0.02em', opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            >
              <span className="text-gradient-gold">Moggy</span>{' '}
              <span className="text-cream-100">Chocolate</span>
            </motion.div>
            <motion.p
              className="mt-4 text-xs font-medium uppercase tracking-[0.4em] text-gold-300/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1 }}
            >
              {TAGLINE}
            </motion.p>
          </motion.div>

          {/* Falling chocolate bar */}
          <AnimatePresence>
            {stage === 'fall' && (
              <motion.div
                key="bar"
                className="absolute left-1/2 top-0 z-20 -translate-x-1/2"
                initial={{ y: '-60vh' }}
                animate={{ y: '12vh' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => stage === 'fall' && setStage('break')}
              >
                <ChocolateBar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Breaking shards + dust */}
          {stage === 'break' && (
            <div className="absolute left-1/2 top-1/2 z-30">
              {/* impact flash */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-200/40 blur-2xl"
                initial={{ scale: 0, opacity: 0.9 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              {shards.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute"
                  style={{ width: s.size, height: s.size }}
                  initial={{ x: 0, y: 0, rotate: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: s.x,
                    y: s.y,
                    rotate: s.rotate,
                    scale: s.scale,
                    opacity: 0,
                  }}
                  transition={{ duration: 1.4, delay: s.delay, ease: 'easeOut' }}
                >
                  <div
                    className="h-full w-full rounded-[4px] bg-gradient-to-br from-choco-700 to-choco-900"
                    style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)' }}
                  />
                </motion.div>
              ))}
              {dust.map((d) => (
                <motion.div
                  key={d.id}
                  className="absolute rounded-full bg-amber-700/50"
                  style={{ width: d.size, height: d.size }}
                  initial={{ x: 0, y: 0, opacity: 0.9 }}
                  animate={{
                    x: d.x,
                    y: d.y,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: d.duration, delay: d.delay, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}

          {/* fade veil */}
          {stage === 'fade' && (
            <motion.div
              className="absolute inset-0 z-40 bg-cream-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChocolateBar() {
  return (
    <div
      className="relative h-44 w-72 overflow-hidden rounded-xl bg-gradient-to-br from-choco-700 via-choco-800 to-choco-950 shadow-choco sm:h-56 sm:w-96"
      style={{ boxShadow: '0 30px 80px -10px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.08)' }}
    >
      {/* squares pattern */}
      <div className="grid h-full w-full grid-cols-4 grid-rows-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border border-choco-900/40"
            style={{ boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)' }}
          />
        ))}
      </div>
      {/* gold foil label */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="font-display text-lg font-bold text-gold-300 sm:text-2xl">Moggy</div>
        <div className="text-[8px] uppercase tracking-[0.3em] text-gold-200/70 sm:text-[10px]">Chocolate</div>
      </div>
      {/* sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10" />
    </div>
  );
}
