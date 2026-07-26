import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '@/context/ShopContext';

type MascotState = 'idle' | 'running' | 'wave' | 'celebrate' | 'hover' | 'returning';
type BlinkState = 'open' | 'blink' | 'wink';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

// Home position (fixed bottom-left)
const HOME_LEFT = 20;
const HOME_BOTTOM = 100;
const MASCOT_W = 68;
const MASCOT_H = 90;

const SPARKLE_COLORS = ['#D4AF37', '#E8638A', '#7BC9A8', '#F2A65A', '#A1887F'];

export default function ChocolateMascot() {
  const { cartAddedAt } = useShop();
  const prevCartAddedAt = useRef(0);

  const [state, setState] = useState<MascotState>('idle');
  const [blinkState, setBlinkState] = useState<BlinkState>('open');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState('');
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Position offset from home (used when running)
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const cursorRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef<MascotState>('idle');
  const runTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sparkleCounter = useRef(0);
  const lastSparklePos = useRef({ x: 0, y: 0 });

  stateRef.current = state;

  // Show mascot after intro
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Periodic blinking & winking
  useEffect(() => {
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        const isWink = Math.random() < 0.25;
        setBlinkState(isWink ? 'wink' : 'blink');
        setTimeout(() => {
          setBlinkState('open');
          scheduleNextBlink();
        }, isWink ? 300 : 150);
      }, delay);
    };
    const t = scheduleNextBlink();
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking — eyes + cursor ref
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };

      // Eye tracking (from mascot center)
      const homeCX = HOME_LEFT + MASCOT_W / 2;
      const homeCY = window.innerHeight - HOME_BOTTOM - MASCOT_H / 2;
      const currentX = homeCX + offset.x;
      const currentY = homeCY + offset.y;

      const dx = e.clientX - currentX;
      const dy = e.clientY - currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = 5;
      const factor = Math.min(dist / 120, 1) * maxD;
      setPupilOffset({
        x: dist < 1 ? 0 : (dx / dist) * factor,
        y: dist < 1 ? 0 : (dy / dist) * factor,
      });

      // Inactivity → wave
      if (stateRef.current === 'idle') {
        if (inactivityRef.current) clearTimeout(inactivityRef.current);
        inactivityRef.current = setTimeout(() => {
          if (stateRef.current === 'idle') {
            setState('wave');
            setTooltip('Hi there! 👋');
            setTimeout(() => { if (stateRef.current === 'wave') { setState('idle'); setTooltip(''); } }, 3000);
          }
        }, 8000);
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [offset.x, offset.y]);

  // Running behavior — chase cursor & leave sparkles
  useEffect(() => {
    if (state !== 'running') return;

    const homeCX = HOME_LEFT + MASCOT_W / 2;
    const homeCY = window.innerHeight - HOME_BOTTOM - MASCOT_H / 2;

    let animFrame: number;
    let currentX = homeCX;
    let currentY = homeCY;

    const tick = () => {
      const { x: cx, y: cy } = cursorRef.current;
      // Smooth chase (lerp)
      currentX += (cx - MASCOT_W / 2 - currentX) * 0.09;
      currentY += (cy - MASCOT_H / 2 - currentY) * 0.09;

      const newOffsetX = currentX - homeCX;
      const newOffsetY = currentY - homeCY;
      setOffset({ x: newOffsetX, y: newOffsetY });

      // Spawn sparkle every ~40px of movement
      const dx = currentX - lastSparklePos.current.x;
      const dy = currentY - lastSparklePos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 30) {
        lastSparklePos.current = { x: currentX, y: currentY };
        const id = sparkleCounter.current++;
        const sparkle: Sparkle = {
          id,
          x: currentX + (Math.random() - 0.5) * 20,
          y: currentY + MASCOT_H / 2 + Math.random() * 10,
          color: SPARKLE_COLORS[id % SPARKLE_COLORS.length],
          size: 4 + Math.random() * 6,
        };
        setSparkles(prev => [...prev.slice(-18), sparkle]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 700);
      }

      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);

    // Stop running after 5-7s
    runTimerRef.current = setTimeout(() => {
      cancelAnimationFrame(animFrame);
      setState('wave');
      setTooltip('Come back! 👋');
      setSparkles([]);
      // Return home after wave
      setTimeout(() => {
        setState('returning');
        setOffset({ x: 0, y: 0 });
        setTimeout(() => { setState('idle'); setTooltip(''); }, 800);
      }, 2000);
    }, 5000 + Math.random() * 2000);

    return () => {
      cancelAnimationFrame(animFrame);
      if (runTimerRef.current) clearTimeout(runTimerRef.current);
    };
  }, [state]);

  // Celebrate when cart item added
  useEffect(() => {
    if (cartAddedAt && cartAddedAt !== prevCartAddedAt.current) {
      prevCartAddedAt.current = cartAddedAt;
      if (stateRef.current === 'idle' || stateRef.current === 'wave') {
        setState('celebrate');
        setTooltip('Yay! Great choice! 🍫');
        setTimeout(() => { setState('idle'); setTooltip(''); }, 3500);
      }
    }
  }, [cartAddedAt]);

  const handleClick = useCallback(() => {
    if (state === 'idle' || state === 'wave' || state === 'hover') {
      setState('running');
      setTooltip('Catch me if you can! 🏃');
      lastSparklePos.current = { x: HOME_LEFT + MASCOT_W / 2, y: window.innerHeight - HOME_BOTTOM - MASCOT_H / 2 };
    }
  }, [state]);

  const isRunning = state === 'running';
  const isWaving = state === 'wave';
  const isCelebrating = state === 'celebrate';
  const isHappy = isHovered || state === 'celebrate';

  // Eye rendering helper
  const renderEye = (cx: number, cy: number, side: 'left' | 'right') => {
    const isWinking = blinkState === 'wink' && side === 'right';
    const isBlinking = blinkState === 'blink';
    const closed = isWinking || isBlinking;

    return (
      <>
        <ellipse cx={cx} cy={cy} rx="9" ry="10" fill="white" />
        {closed ? (
          // Closed eye arc
          <path
            d={`M ${cx - 8} ${cy} Q ${cx} ${cy - 5} ${cx + 8} ${cy}`}
            stroke="#1A0F08" strokeWidth="2" strokeLinecap="round" fill="none"
          />
        ) : (
          <>
            <circle cx={cx + pupilOffset.x} cy={cy + pupilOffset.y} r="6" fill="#2A1810" />
            <circle cx={cx + pupilOffset.x} cy={cy + pupilOffset.y} r="3.5" fill="#1A0F08" />
            <circle cx={cx + pupilOffset.x + 1.5} cy={cy + pupilOffset.y - 1.5} r="1.5" fill="white" />
          </>
        )}
      </>
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Sparkle trail (fixed position, screen-space) */}
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              className="pointer-events-none fixed z-[79] rounded-full"
              style={{ left: s.x, top: s.y, width: s.size, height: s.size, background: s.color, x: '-50%', y: '-50%' }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}

          {/* Mascot container — offset from home position */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.6 }}
            animate={{ opacity: 1, x: offset.x, y: offset.y, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.6 }}
            transition={
              state === 'returning'
                ? { x: { type: 'spring', stiffness: 160, damping: 22 }, y: { type: 'spring', stiffness: 160, damping: 22 } }
                : state === 'running'
                ? { x: { duration: 0 }, y: { duration: 0 }, opacity: { duration: 0.4 } }
                : { type: 'spring', stiffness: 280, damping: 22 }
            }
            className="fixed z-[80] select-none"
            style={{ left: HOME_LEFT, bottom: HOME_BOTTOM, cursor: 'pointer' }}
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            role="button"
            aria-label="Moggy mascot — click me!"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {tooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-choco-900 px-3 py-1.5 text-xs font-medium text-cream-100 shadow-choco"
                >
                  {tooltip}
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-choco-900" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Celebrate particles */}
            {isCelebrating && Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ width: 7, height: 7, background: SPARKLE_COLORS[i % SPARKLE_COLORS.length] }}
                initial={{ x: '-50%', y: '-50%', scale: 0 }}
                animate={{
                  x: `calc(-50% + ${Math.cos(i * 36 * Math.PI / 180) * 50}px)`,
                  y: `calc(-50% + ${Math.sin(i * 36 * Math.PI / 180) * 50}px)`,
                  scale: [0, 1.3, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.9, delay: i * 0.04, ease: 'easeOut' }}
              />
            ))}

            {/* Body with breathing / running / celebrating motion */}
            <motion.div
              animate={
                isCelebrating
                  ? { y: [0, -18, 0, -12, 0], rotate: [0, -6, 6, -4, 0] }
                  : isRunning
                  ? { y: [0, -6, 0], rotate: [0, -3, 3, 0] }
                  : { y: [0, -3, 0] }
              }
              transition={
                isCelebrating
                  ? { duration: 0.8, ease: 'easeOut' }
                  : isRunning
                  ? { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <svg
                width={MASCOT_W}
                height={MASCOT_H}
                viewBox="0 0 68 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(42,24,16,0.6))' }}
              >
                <defs>
                  <radialGradient id="mg-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#8D6E63" />
                    <stop offset="45%" stopColor="#4E3322" />
                    <stop offset="100%" stopColor="#2A1810" />
                  </radialGradient>
                  <radialGradient id="mg-belly" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#BCAAA4" />
                    <stop offset="100%" stopColor="#A1887F" />
                  </radialGradient>
                  <radialGradient id="mg-choc" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#8D6E63" />
                    <stop offset="100%" stopColor="#3B2418" />
                  </radialGradient>
                </defs>

                {/* Left leg (running alternates) */}
                <motion.g
                  animate={isRunning ? { rotate: [-20, 20, -20] } : { rotate: 0 }}
                  transition={isRunning ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : {}}
                  style={{ transformOrigin: '22px 72px' }}
                >
                  <ellipse cx="22" cy="78" rx="8" ry="10" fill="url(#mg-body)" />
                  <ellipse cx="20" cy="87" rx="6" ry="4" fill="#2A1810" />
                </motion.g>

                {/* Right leg */}
                <motion.g
                  animate={isRunning ? { rotate: [20, -20, 20] } : { rotate: 0 }}
                  transition={isRunning ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : {}}
                  style={{ transformOrigin: '46px 72px' }}
                >
                  <ellipse cx="46" cy="78" rx="8" ry="10" fill="url(#mg-body)" />
                  <ellipse cx="48" cy="87" rx="6" ry="4" fill="#2A1810" />
                </motion.g>

                {/* Left arm */}
                <motion.g
                  animate={
                    isWaving ? { rotate: [0, -40, 0, -40, 0], transformOrigin: '12px 44px' }
                    : isRunning ? { rotate: [20, -20, 20], transformOrigin: '12px 44px' }
                    : { rotate: 0 }
                  }
                  transition={
                    isWaving ? { duration: 0.6, repeat: 3 }
                    : isRunning ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                  }
                >
                  <ellipse cx="10" cy="46" rx="8" ry="12" fill="url(#mg-body)" />
                  <ellipse cx="8" cy="57" rx="5.5" ry="5" fill="#4E3322" />

                  {/* Tiny chocolate bar in left hand (idle only) */}
                  {!isRunning && !isWaving && !isCelebrating && (
                    <g transform="translate(1 56) rotate(-20 4 4)">
                      <rect width="12" height="7" rx="1.5" fill="url(#mg-choc)" />
                      <line x1="4" y1="0" x2="4" y2="7" stroke="#2A1810" strokeWidth="0.8" opacity="0.5" />
                      <line x1="8" y1="0" x2="8" y2="7" stroke="#2A1810" strokeWidth="0.8" opacity="0.5" />
                      <line x1="0" y1="3.5" x2="12" y2="3.5" stroke="#2A1810" strokeWidth="0.8" opacity="0.5" />
                    </g>
                  )}
                </motion.g>

                {/* Right arm */}
                <motion.g
                  animate={
                    isCelebrating ? { rotate: [0, 40, 0, 40, 0], transformOrigin: '58px 44px' }
                    : isRunning ? { rotate: [-20, 20, -20], transformOrigin: '58px 44px' }
                    : { rotate: 0 }
                  }
                  transition={
                    isCelebrating ? { duration: 0.5, repeat: 3 }
                    : isRunning ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                  }
                >
                  <ellipse cx="58" cy="46" rx="8" ry="12" fill="url(#mg-body)" />
                  <ellipse cx="60" cy="57" rx="5.5" ry="5" fill="#4E3322" />
                </motion.g>

                {/* Body */}
                <ellipse cx="34" cy="57" rx="22" ry="22" fill="url(#mg-body)" />
                {/* Glossy belly */}
                <ellipse cx="34" cy="60" rx="12" ry="11" fill="url(#mg-belly)" opacity="0.65" />
                {/* Body sheen */}
                <ellipse cx="26" cy="48" rx="6" ry="4" fill="white" opacity="0.07" transform="rotate(-20 26 48)" />

                {/* Head */}
                <ellipse cx="34" cy="30" rx="24" ry="26" fill="url(#mg-body)" />
                {/* Head sheen */}
                <ellipse cx="26" cy="18" rx="9" ry="7" fill="white" opacity="0.09" transform="rotate(-18 26 18)" />

                {/* Ears */}
                <ellipse cx="12" cy="18" rx="6" ry="7" fill="url(#mg-body)" />
                <ellipse cx="56" cy="18" rx="6" ry="7" fill="url(#mg-body)" />
                <ellipse cx="12" cy="18" rx="3.5" ry="4.5" fill="#4E3322" opacity="0.5" />
                <ellipse cx="56" cy="18" rx="3.5" ry="4.5" fill="#4E3322" opacity="0.5" />

                {/* Eyes */}
                {renderEye(23, 26, 'left')}
                {renderEye(45, 26, 'right')}

                {/* Eyebrows */}
                <path
                  d="M15 15 Q23 11 30 15"
                  stroke="#1A0F08" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  transform={isHappy || isCelebrating ? 'translate(0,-2)' : ''}
                />
                <path
                  d="M38 15 Q45 11 53 15"
                  stroke="#1A0F08" strokeWidth="2.5" strokeLinecap="round" fill="none"
                  transform={isHappy || isCelebrating ? 'translate(0,-2)' : ''}
                />

                {/* Mouth */}
                {isHappy || isCelebrating ? (
                  <path d="M21 40 Q34 54 47 40" stroke="#1A0F08" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : isRunning ? (
                  // Open excited mouth
                  <ellipse cx="34" cy="41" rx="6" ry="4" fill="#1A0F08" />
                ) : (
                  <path d="M25 40 Q34 48 43 40" stroke="#1A0F08" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                )}

                {/* Rosy cheeks when happy */}
                {(isHappy || isCelebrating) && (
                  <>
                    <ellipse cx="17" cy="35" rx="5" ry="3" fill="#E8638A" opacity="0.35" />
                    <ellipse cx="51" cy="35" rx="5" ry="3" fill="#E8638A" opacity="0.35" />
                  </>
                )}

                {/* Hover cheeks */}
                {isHovered && !isHappy && (
                  <>
                    <ellipse cx="17" cy="35" rx="4" ry="2.5" fill="#E8638A" opacity="0.25" />
                    <ellipse cx="51" cy="35" rx="4" ry="2.5" fill="#E8638A" opacity="0.25" />
                  </>
                )}

                {/* Crown */}
                <path d="M24 6 L29 13 L34 4 L39 13 L44 6 L42 15 L26 15 Z" fill="#D4AF37" opacity="0.95" />
                <rect x="26" y="15" width="16" height="3.5" rx="1.2" fill="#D4AF37" opacity="0.85" />
                <circle cx="34" cy="7.5" r="2.2" fill="#E8638A" />
                <circle cx="26.5" cy="11" r="1.5" fill="#7BC9A8" />
                <circle cx="41.5" cy="11" r="1.5" fill="#7BC9A8" />

                {/* Speed lines when running */}
                {isRunning && (
                  <g opacity="0.4">
                    <line x1="-8" y1="40" x2="-20" y2="40" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                    <line x1="-8" y1="50" x2="-22" y2="50" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="-8" y1="60" x2="-18" y2="60" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" />
                  </g>
                )}
              </svg>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
