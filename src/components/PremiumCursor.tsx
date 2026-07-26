import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function PremiumCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 600, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 600, damping: 35 });

  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);
  const dotSpringX = useSpring(dotX, { stiffness: 1200, damping: 40 });
  const dotSpringY = useSpring(dotY, { stiffness: 1200, damping: 40 });

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const rippleCounter = useRef(0);
  const particleCounter = useRef(0);
  const lastPos = useRef({ x: -200, y: -200 });
  const particleThrottle = useRef(0);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      setVisible(true);

      // Spawn particles on fast movement
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastPos.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      if (speed > 6 && now - particleThrottle.current > 40) {
        particleThrottle.current = now;
        const newParticles: Particle[] = Array.from({ length: 3 }, () => ({
          id: particleCounter.current++,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 1,
          life: 1,
        }));
        setParticles(prev => [...prev.slice(-20), ...newParticles]);
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 600);
      }
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    const onDown = (e: MouseEvent) => {
      setClicking(true);
      const id = rippleCounter.current++;
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 700);
    };
    const onUp = () => setClicking(false);

    const onHoverChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea')
      );
      setHovering(isInteractive);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousemove', onHoverChange);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    // Hide default cursor
    document.documentElement.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousemove', onHoverChange);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.documentElement.style.cursor = '';
    };
  }, [cursorX, cursorY, dotX, dotY]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r.id}
            className="absolute rounded-full border border-gold-400/60"
            style={{ left: r.x, top: r.y, x: '-50%', y: '-50%' }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 60, height: 60, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-gold-400"
          style={{ left: p.x, top: p.y, x: '-50%', y: '-50%' }}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 0, x: p.vx * 20 - 3, y: p.vy * 20 - 3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}

      {/* Outer ring cursor */}
      <motion.div
        className="absolute rounded-full border-2 border-gold-400/70"
        style={{
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          width: hovering ? 44 : clicking ? 24 : 36,
          height: hovering ? 44 : clicking ? 24 : 36,
          opacity: visible ? 1 : 0,
        }}
        transition={{ width: { duration: 0.15 }, height: { duration: 0.15 } }}
      />

      {/* Crown cursor center */}
      <motion.div
        style={{
          left: dotSpringX,
          top: dotSpringY,
          x: '-50%',
          y: '-50%',
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.7 : hovering ? 1.4 : 1,
        }}
        className="absolute"
        transition={{ scale: { duration: 0.12 } }}
      >
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
          <defs>
            <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7E9C3" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A07F22" />
            </linearGradient>
          </defs>
          {/* Crown pointer shape */}
          <path d="M10 0 L13 5 L17 2 L15 9 L5 9 L3 2 L7 5 Z" fill="url(#cursorGrad)" />
          <rect x="5" y="9" width="10" height="3" rx="1" fill="url(#cursorGrad)" />
          {/* Arrow/pointer */}
          <path d="M8 12 L10 22 L12 12Z" fill="url(#cursorGrad)" />
          {/* Jewel */}
          <circle cx="10" cy="3" r="1.5" fill="#E8638A" />
        </svg>
      </motion.div>
    </div>
  );
}
