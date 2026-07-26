import { motion } from 'framer-motion';

interface CrownedLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function CrownedLogo({ size = 48, animate = true, className = '' }: CrownedLogoProps) {
  const sparklePositions = [
    { x: -18, y: -22, delay: 0 },
    { x: 18, y: -22, delay: 0.3 },
    { x: -24, y: -8, delay: 0.6 },
    { x: 24, y: -8, delay: 0.9 },
    { x: 0, y: -28, delay: 1.2 },
  ];

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Glow */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Sparkles */}
      {animate && sparklePositions.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: '50%', top: '50%' }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            x: s.x,
            y: s.y,
          }}
          transition={{ duration: 1.8, delay: s.delay, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
        >
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M3 0L3.5 2.5L6 3L3.5 3.5L3 6L2.5 3.5L0 3L2.5 2.5L3 0Z" fill="#D4AF37" />
          </svg>
        </motion.div>
      ))}

      {/* Main SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7E9C3" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="65%" stopColor="#C29F2E" />
            <stop offset="100%" stopColor="#7C6119" />
          </linearGradient>
          <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F7E9C3" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A07F22" />
          </linearGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="24" cy="28" r="18" fill="#2A1810" />
        <circle cx="24" cy="28" r="18" fill="url(#goldGrad)" opacity="0.15" />

        {/* Crown */}
        {/* Crown base band */}
        <rect x="10" y="17" width="28" height="6" rx="2" fill="url(#crownGrad)" />
        {/* Crown points */}
        <path d="M10 17 L15 8 L20 14 L24 6 L28 14 L33 8 L38 17Z" fill="url(#crownGrad)" />
        {/* Crown jewels */}
        <circle cx="24" cy="9" r="2.5" fill="#E8638A" opacity="0.9" />
        <circle cx="15.5" cy="11" r="1.5" fill="#7BC9A8" opacity="0.9" />
        <circle cx="32.5" cy="11" r="1.5" fill="#7BC9A8" opacity="0.9" />
        {/* Crown diamonds */}
        <circle cx="17" cy="20" r="1.2" fill="#F7E9C3" opacity="0.8" />
        <circle cx="24" cy="20" r="1.2" fill="#F7E9C3" opacity="0.8" />
        <circle cx="31" cy="20" r="1.2" fill="#F7E9C3" opacity="0.8" />

        {/* Letter M */}
        <text
          x="24"
          y="38"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontWeight="bold"
          fontSize="18"
          fill="url(#goldGrad)"
          filter="url(#goldGlow)"
        >
          M
        </text>

        {/* Sheen overlay on circle */}
        <path
          d="M14 18 Q24 22 34 18 Q34 28 24 32 Q14 28 14 18Z"
          fill="white"
          opacity="0.05"
        />
      </svg>
    </div>
  );
}
