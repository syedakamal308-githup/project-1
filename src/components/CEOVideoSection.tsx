import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, X, Captions } from 'lucide-react';
import CrownedLogo from '@/components/CrownedLogo';

const CEO_QUOTE =
  '"Every Moggy Chocolate is freshly crafted using carefully selected cocoa beans and premium ingredients to deliver a rich, smooth, and unforgettable taste."';

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function CEOVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [modalOpen, setModalOpen] = useState(false);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <>
      {/* Section */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-choco-950 py-24"
      >
        {/* Ambient radial light */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.08) 0%, transparent 65%)' }}
        />

        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute rounded-full bg-gold-400/15"
            style={{ width: 8 + i * 4, height: 8 + i * 4, left: `${12 + i * 14}%`, bottom: '-12px' }}
            animate={{ y: [0, -(220 + i * 30)], opacity: [0, 0.6, 0] }}
            transition={{ duration: 9 + i * 2, delay: i * 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        <div className="container-luxe">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left — Portrait / Play card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Glow frame */}
              <div className="relative overflow-hidden rounded-3xl shadow-choco">
                {/* Luxury office backdrop */}
                <div
                  className="flex h-[420px] w-full items-end justify-center overflow-hidden"
                  style={{
                    background: 'linear-gradient(160deg, #1A0F08 0%, #2A1810 40%, #3B2418 70%, #1A0F08 100%)',
                  }}
                >
                  {/* Decorative office elements */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="h-64 w-64 rounded-full border border-gold-400/30" />
                    <div className="absolute h-96 w-96 rounded-full border border-gold-400/15" />
                  </div>

                  {/* Bookshelf silhouette */}
                  <div className="absolute bottom-0 left-0 right-0 h-20"
                    style={{ background: 'linear-gradient(to top, rgba(26,15,8,0.9), transparent)' }} />

                  {/* CEO silhouette / placeholder illustration */}
                  <svg
                    viewBox="0 0 200 340"
                    width="200"
                    height="340"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    {/* Business suit silhouette */}
                    <defs>
                      <radialGradient id="ceoGrad" cx="50%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="#6D4C41" />
                        <stop offset="100%" stopColor="#2A1810" />
                      </radialGradient>
                      <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B3B3B" />
                        <stop offset="100%" stopColor="#1A1A1A" />
                      </linearGradient>
                    </defs>
                    {/* Head */}
                    <ellipse cx="100" cy="70" rx="38" ry="42" fill="url(#ceoGrad)" />
                    {/* Hair */}
                    <path d="M62 58 Q80 20 100 18 Q120 20 138 58 Q130 40 100 38 Q70 40 62 58Z" fill="#1A0F08" />
                    {/* Shoulders & suit */}
                    <path d="M30 200 Q30 120 65 108 L100 130 L135 108 Q170 120 170 200Z" fill="url(#suitGrad)" />
                    {/* Shirt & tie */}
                    <path d="M88 110 L100 130 L112 110 L108 108 L100 118 L92 108Z" fill="#F5F0EC" opacity="0.9" />
                    <rect x="97" y="118" width="6" height="30" rx="2" fill="#D4AF37" opacity="0.8" />
                    {/* Glasses */}
                    <ellipse cx="88" cy="72" rx="13" ry="10" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.8" />
                    <ellipse cx="112" cy="72" rx="13" ry="10" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.8" />
                    <line x1="101" y1="72" x2="99" y2="72" stroke="#D4AF37" strokeWidth="2" opacity="0.8" />
                    {/* Eyes */}
                    <ellipse cx="88" cy="73" rx="5" ry="4" fill="#1A0F08" opacity="0.7" />
                    <ellipse cx="112" cy="73" rx="5" ry="4" fill="#1A0F08" opacity="0.7" />
                    {/* Smile */}
                    <path d="M90 90 Q100 98 110 90" stroke="#4E3322" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
                    {/* Bottom fade */}
                    <rect x="0" y="280" width="200" height="60" fill="url(#suitGrad)" />
                  </svg>

                  {/* Gold accent line */}
                  <div className="absolute bottom-[88px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
                </div>

                {/* Name plate */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-choco-950 via-choco-950/95 to-transparent px-6 py-5">
                  <p className="font-display text-lg font-bold text-cream-100">Sarah Al-Moggy</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold-400">Founder & CEO</p>
                </div>

                {/* Play button overlay */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100"
                  aria-label="Play CEO video"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-choco-950/80 ring-2 ring-gold-400 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                    <Play className="h-8 w-8 translate-x-0.5 text-gold-400" fill="currentColor" />
                  </div>
                </button>
              </div>

              {/* Gold border glow */}
              <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-gold-400/20" />
            </motion.div>

            {/* Right — Text content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-gold-400/50" />
                <span className="eyebrow text-gold-400">Meet Our Founder</span>
              </div>

              <h2 className="font-display text-4xl font-bold leading-tight text-cream-100 md:text-5xl">
                The Passion<br />
                <span className="text-gradient-gold">Behind Every Bite</span>
              </h2>

              {/* Quote */}
              <blockquote className="relative pl-5">
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-gold-400/80 to-transparent" />
                <p className="text-base italic leading-relaxed text-cream-100/75">{CEO_QUOTE}</p>
                <footer className="mt-3 text-sm font-semibold text-gold-400">— Sarah Al-Moggy</footer>
              </blockquote>

              <p className="text-sm leading-relaxed text-cream-100/60">
                With over a decade of experience in luxury confectionery, Sarah founded Moggy Chocolate
                with one vision: to deliver world-class chocolates crafted with love, to customers everywhere.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '10+', label: 'Years of Craft' },
                  { value: '50+', label: 'Countries' },
                  { value: '13', label: 'Signature Flavors' },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl border border-gold-400/15 bg-choco-900/50 p-4 text-center">
                    <div className="font-display text-2xl font-bold text-gradient-gold">{s.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-cream-100/50">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Play CTA */}
              <button
                onClick={() => setModalOpen(true)}
                className="btn-gold self-start"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Watch CEO Introduction
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {modalOpen && (
          <VideoModal onClose={() => setModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function VideoModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [captions, setCaptions] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnded = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      v.removeEventListener('ended', onEnded);
    };
  }, [volume]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const changeVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    if (v) v.volume = val;
    setVolume(val);
    setMuted(val === 0);
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * duration;
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-choco-950/92 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-[101] flex flex-col items-center justify-center px-4"
      >
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CrownedLogo size={36} animate={false} />
              <div>
                <p className="font-display text-sm font-bold text-cream-100">Sarah Al-Moggy</p>
                <p className="text-[10px] uppercase tracking-widest text-gold-400">CEO Introduction</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-choco-800/80 text-cream-100/70 backdrop-blur-sm transition hover:bg-choco-700 hover:text-cream-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Video player */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-choco-950 shadow-choco ring-1 ring-gold-400/20"
            onMouseMove={resetControlsTimer}
            onMouseEnter={resetControlsTimer}
            onClick={togglePlay}
            style={{ cursor: 'pointer' }}
          >
            <video
              ref={videoRef}
              src="/ceo_video.mp4"
              className="aspect-video w-full object-cover"
              preload="metadata"
              playsInline
              onClick={e => e.stopPropagation()}
            />

            {/* Captions overlay (decorative if enabled) */}
            {captions && currentTime > 0 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-8">
                <p className="rounded-lg bg-choco-950/80 px-4 py-2 text-center text-sm text-cream-100 backdrop-blur-sm">
                  Moggy Chocolate — Crafted with Passion, Loved Worldwide.
                </p>
              </div>
            )}

            {/* Big play button (center, shown when paused) */}
            <AnimatePresence>
              {!playing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-choco-950/70 ring-2 ring-gold-400 backdrop-blur-sm">
                    <Play className="h-9 w-9 translate-x-0.5 text-gold-400" fill="currentColor" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <motion.div
              animate={{ opacity: showControls || !playing ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-choco-950/95 via-choco-950/60 to-transparent px-4 pb-3 pt-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div
                ref={progressRef}
                className="group/bar mb-3 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-cream-100/20 transition-all hover:h-2.5"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-cream-100 transition hover:text-gold-400"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" fill="currentColor" />}
                  </button>

                  {/* Replay */}
                  <button
                    onClick={replay}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100/70 transition hover:text-gold-400"
                    aria-label="Replay"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleMute}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100/70 transition hover:text-gold-400"
                      aria-label={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={muted ? 0 : volume}
                      onChange={changeVolume}
                      className="h-1 w-16 cursor-pointer accent-gold-400"
                      aria-label="Volume"
                    />
                  </div>

                  {/* Time */}
                  <span className="text-xs text-cream-100/60 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Captions */}
                  <button
                    onClick={() => setCaptions(v => !v)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${captions ? 'text-gold-400' : 'text-cream-100/70 hover:text-gold-400'}`}
                    aria-label="Toggle captions"
                  >
                    <Captions className="h-4 w-4" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100/70 transition hover:text-gold-400"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer branding */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gold-400/30" />
            <p className="text-center text-xs text-cream-100/40">
              Moggy Chocolate — Crafted with Passion, Loved Worldwide.
            </p>
            <div className="h-px w-12 bg-gold-400/30" />
          </div>
        </div>
      </motion.div>
    </>
  );
}
