import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Music2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: ['Our Chocolates', 'Premium Collection', 'Sugar-Free', 'Gift Baskets', 'New Arrivals'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Our Story', 'Sustainability', 'Careers', 'Press'],
  },
  {
    title: 'Support',
    links: ['FAQ', 'Shipping', 'Returns', 'Track Order', 'Contact Us'],
  },
];

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-choco-950 pt-20 text-cream-100">
      <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />

      <div className="container-luxe relative">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl rounded-3xl border border-gold-400/20 bg-gradient-to-br from-choco-800/80 to-choco-900/80 p-10 text-center backdrop-blur-md sm:p-14"
        >
          <h3 className="font-display text-2xl font-bold sm:text-3xl">
            Join the <span className="text-gradient-gold">Moggy Circle</span>
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream-100/70">
            Subscribe for early access to new flavors, exclusive offers, and a 10% welcome discount.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
              setTimeout(() => setSubscribed(false), 3500);
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-cream-100 placeholder-cream-100/40 outline-none transition-colors focus:border-gold-400/60"
            />
            <button type="submit" className="btn-gold whitespace-nowrap">
              {subscribed ? 'Subscribed!' : 'Subscribe'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-gold-300"
            >
              Welcome to the circle! Check your inbox for your discount code.
            </motion.p>
          )}
        </motion.div>

        {/* Links */}
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#home" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-choco-900">
                <span className="font-display text-xl font-bold">M</span>
              </div>
              <div>
                <div className="font-display text-lg font-bold">Moggy</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-300">Chocolate</div>
              </div>
            </a>
            <p className="mt-4 max-w-xs text-sm text-cream-100/60">
              Every bite, pure happiness. Premium chocolates crafted with love since 1998.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Youtube, Music2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream-100/70 transition-all hover:border-gold-400/40 hover:bg-gold-400 hover:text-choco-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold-300">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-cream-100/60 transition-colors hover:text-cream-100"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-cream-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Moggy Chocolate. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="#" className="transition-colors hover:text-cream-100">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-cream-100">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-cream-100">FAQ</a>
            <a href="#" className="transition-colors hover:text-cream-100">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
