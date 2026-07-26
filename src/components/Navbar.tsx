import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import CrownedLogo from '@/components/CrownedLogo';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Chocolates', href: '#collection' },
  { label: 'Premium Collection', href: '#collection' },
  { label: 'Sugar-Free', href: '#sugarfree' },
  { label: 'Gift Basket', href: '#gift' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const { cartCount, wishlist, openCart, openWishlist, setSearchOpen } = useShop();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-choco-900/85 backdrop-blur-xl shadow-choco'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-luxe flex items-center justify-between py-4">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <CrownedLogo size={44} animate={true} />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-cream-100">
                Moggy
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-300">
                Chocolate
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group relative rounded-full px-3.5 py-2 text-sm font-medium text-cream-100/80 transition-colors hover:text-cream-100"
                >
                  {l.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gold-400 transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </IconButton>
            <IconButton label="Wishlist" onClick={openWishlist} badge={wishlist.length}>
              <Heart className="h-5 w-5" />
            </IconButton>
            <IconButton label="Cart" onClick={openCart} badge={cartCount}>
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-cream-100 transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden bg-choco-900/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="container-luxe flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-cream-100/90 transition-colors hover:bg-white/10"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.header>
  );
}

function IconButton({
  children,
  onClick,
  label,
  badge,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-cream-100 transition-all hover:bg-white/10 hover:text-gold-300 active:scale-90"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <motion.span
          key={badge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-choco-900"
        >
          {badge}
        </motion.span>
      )}
    </button>
  );
}
