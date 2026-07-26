import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '@/context/ShopContext';

type MascotState = 'idle' | 'wave' | 'celebrate' | 'happy' | 'hidden';

export default function ChocolateMascot() {
  const mascotRef = useRef<HTMLDivElement>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cartAddedAt } = useShop();
  const prevCartAddedAt = useRef(0);

  const [state, setState] = useState<MascotState>('idle');
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState('');

  // Show mascot after a delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Mouse tracking for eye movement
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2 - 20;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = 5;
      const factor = Math.min(dist / 120, 1) * maxD;
      setPupilOffset({
        x: dist < 1 ? 0 : (dx / dist) * factor,
        y: dist < 1 ? 0 : (dy / dist) * factor,
      });

      // Reset inactivity timer
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (state === 'wave') setState('idle');
      inactivityTimer.current = setTimeout(() => {
        setState('wave');
        setTooltip('Hi there! 👋');
        setTimeout(() => { setState('idle'); setTooltip(''); }, 3000);
      }, 6000);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [state]);

  // Celebrate when cart item added
  useEffect(() => {
    if (cartAddedAt && cartAddedAt !== prevCartAddedAt.current) {
      prevCartAddedAt.current = cartAddedAt;
      setState('celebrate');
      setTooltip('Great choice! 🍫');
      setTimeout(() => { setState('idle'); setTooltip(''); }, 3000);
    }
  }, [cartAddedAt]);

  const handleClick = useCallback(() => {
    setState('happy');
    setTooltip('Moggy loves you! 💛');
    setTimeout(() => { setState('idle'); setTooltip(''); }, 2000);
  }, []);

  const isWaving = state === 'wave';
  const isCelebrating = state === 'celebrate';
  const isHappy = state === 'happy';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={mascotRef}
          initial={{ opacity: 0, y: 60, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="fixed bottom-24 right-5 z-[80] select-none"
          style={{ cursor: 'pointer' }}
          onClick={handleClick}
          role="button"
          aria-label="Moggy mascot"
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
          {isCelebrating && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: 6,
                height: 6,
                background: ['#D4AF37','#E8638A','#7BC9A8','#F2A65A'][i % 4],
              }}
              initial={{ x: '-50%', y: '-50%', scale: 0 }}
              animate={{
                x: `calc(-50% + ${(Math.cos(i * 45 * Math.PI / 180) * 40)}px)`,
                y: `calc(-50% + ${(Math.sin(i * 45 * Math.PI / 180) * 40)}px)`,
                scale: [0, 1.2, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
            />
          ))}

          {/* Mascot body */}
          <motion.div
            animate={
              isCelebrating
                ? { y: [0, -16, 0, -10, 0], rotate: [0, -5, 5, -3, 0] }
                : { y: [0, -3, 0] }
            }
            transition={
              isCelebrating
                ? { duration: 0.8, ease: 'easeOut' }
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <svg
              width="68"
              height="82"
              viewBox="0 0 68 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 8px 20px rgba(42,24,16,0.5))' }}
            >
              <defs>
                <radialGradient id="bodyGrad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#6D4C41" />
                  <stop offset="60%" stopColor="#3B2418" />
                  <stop offset="100%" stopColor="#2A1810" />
                </radialGradient>
                <radialGradient id="bellyGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#A1887F" />
                  <stop offset="100%" stopColor="#8D6E63" />
                </radialGradient>
              </defs>

              {/* Left arm */}
              <motion.g
                animate={isWaving ? { rotate: [-10, 30, -10], transformOrigin: '14px 42px' } : { rotate: 0 }}
                transition={isWaving ? { duration: 0.7, repeat: 3, ease: 'easeInOut' } : {}}
              >
                <ellipse cx="10" cy="46" rx="8" ry="11" fill="url(#bodyGrad)" />
                <ellipse cx="8" cy="55" rx="5" ry="5" fill="#6D4C41" />
              </motion.g>

              {/* Right arm */}
              <motion.g
                animate={
                  isCelebrating
                    ? { rotate: [-10, 30, -10], transformOrigin: '58px 42px' }
                    : { rotate: 0 }
                }
                transition={
                  isCelebrating
                    ? { duration: 0.5, repeat: 3, ease: 'easeInOut' }
                    : {}
                }
              >
                <ellipse cx="58" cy="46" rx="8" ry="11" fill="url(#bodyGrad)" />
                <ellipse cx="60" cy="55" rx="5" ry="5" fill="#6D4C41" />
              </motion.g>

              {/* Body */}
              <ellipse cx="34" cy="54" rx="22" ry="24" fill="url(#bodyGrad)" />

              {/* Belly */}
              <ellipse cx="34" cy="58" rx="12" ry="11" fill="url(#bellyGrad)" opacity="0.7" />

              {/* Head */}
              <ellipse cx="34" cy="30" rx="24" ry="26" fill="url(#bodyGrad)" />

              {/* Sheen */}
              <ellipse cx="28" cy="20" rx="8" ry="6" fill="white" opacity="0.08" transform="rotate(-20 28 20)" />

              {/* Left eye white */}
              <ellipse cx="24" cy="26" rx="9" ry="10" fill="white" />
              {/* Left iris */}
              <circle cx={24 + pupilOffset.x} cy={26 + pupilOffset.y} r="6" fill="#2A1810" />
              {/* Left pupil */}
              <circle cx={24 + pupilOffset.x} cy={26 + pupilOffset.y} r="3.5" fill="#1A0F08" />
              {/* Left pupil shine */}
              <circle cx={24 + pupilOffset.x + 1.5} cy={26 + pupilOffset.y - 1.5} r="1.5" fill="white" />

              {/* Right eye white */}
              <ellipse cx="44" cy="26" rx="9" ry="10" fill="white" />
              {/* Right iris */}
              <circle cx={44 + pupilOffset.x} cy={26 + pupilOffset.y} r="6" fill="#2A1810" />
              {/* Right pupil */}
              <circle cx={44 + pupilOffset.x} cy={26 + pupilOffset.y} r="3.5" fill="#1A0F08" />
              {/* Right pupil shine */}
              <circle cx={44 + pupilOffset.x + 1.5} cy={26 + pupilOffset.y - 1.5} r="1.5" fill="white" />

              {/* Eyebrows */}
              <path
                d="M16 15 Q24 12 30 15"
                stroke="#1A0F08"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                transform={isHappy || isCelebrating ? 'translate(0 -2)' : 'translate(0 0)'}
              />
              <path
                d="M38 15 Q44 12 52 15"
                stroke="#1A0F08"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                transform={isHappy || isCelebrating ? 'translate(0 -2)' : 'translate(0 0)'}
              />

              {/* Mouth */}
              {isHappy || isCelebrating ? (
                // Big happy smile
                <path d="M22 40 Q34 52 46 40" stroke="#1A0F08" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              ) : (
                // Regular smile
                <path d="M25 40 Q34 48 43 40" stroke="#1A0F08" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              )}

              {/* Cheeks */}
              {(isHappy || isCelebrating) && (
                <>
                  <ellipse cx="18" cy="36" rx="5" ry="3" fill="#E8638A" opacity="0.4" />
                  <ellipse cx="50" cy="36" rx="5" ry="3" fill="#E8638A" opacity="0.4" />
                </>
              )}

              {/* Gold crown detail */}
              <path d="M26 6 L30 12 L34 4 L38 12 L42 6 L40 14 L28 14 Z" fill="#D4AF37" opacity="0.9" />
              <rect x="28" y="14" width="12" height="3" rx="1" fill="#D4AF37" opacity="0.8" />
              <circle cx="34" cy="7" r="2" fill="#E8638A" />

              {/* Feet */}
              <ellipse cx="26" cy="77" rx="8" ry="5" fill="#2A1810" />
              <ellipse cx="42" cy="77" rx="8" ry="5" fill="#2A1810" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
