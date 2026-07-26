import { motion } from 'framer-motion';
import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Instagram, Facebook, Youtube, Music2 } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-choco-900 py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-choco-950 to-choco-900" />
      <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />

      <div className="container-luxe relative">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow justify-center text-gold-400"
          >
            Get in Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-display text-3xl font-bold text-cream-100 sm:text-5xl"
          >
            Let's <span className="text-gradient-gold">Talk Chocolate</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-md text-cream-100/70"
          >
            Questions, custom orders, or corporate gifting — our team would love to hear from you.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Contact info + map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-4 sm:grid-cols-1">
              {[
                { icon: Phone, label: 'Call Us', value: '+1 (800) 664-4925', href: 'tel:+18006644925' },
                { icon: Mail, label: 'Email Us', value: 'hello@moggychocolate.com', href: 'mailto:hello@moggychocolate.com' },
                { icon: MapPin, label: 'Visit Us', value: '42 Cocoa Lane, Brussels, Belgium', href: '#' },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-gold-400/40 hover:bg-white/10"
                >
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300 transition-colors group-hover:bg-gold-400 group-hover:text-choco-900">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gold-400">{c.label}</div>
                    <div className="font-medium text-cream-100">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Map */}
            <div className="relative flex h-56 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-choco-900 shadow-choco">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.08),transparent_70%)]" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-choco-900 shadow-glow-gold">
                  <MapPin className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-cream-100">Moggy Chocolate</p>
                  <p className="text-sm text-cream-100/60">42 Cocoa Lane, Brussels, Belgium</p>
                </div>
                <a
                  href="https://www.openstreetmap.org/?mlat=50.85&mlon=4.363#map=14/50.85/4.363"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gold-400/40 bg-white/5 px-4 py-1.5 text-xs font-medium text-gold-300 transition-all hover:bg-gold-400 hover:text-choco-900"
                >
                  Open in Maps
                </a>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-choco-950/40 to-transparent" />
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Youtube, label: 'YouTube' },
                { icon: Music2, label: 'TikTok' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream-100/80 transition-all hover:border-gold-400/40 hover:bg-gold-400 hover:text-choco-900 active:scale-90"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
          >
            <div className="grid gap-5">
              <Field label="Your Name" name="name" type="text" placeholder="Jane Doe" />
              <Field label="Email Address" name="email" type="email" placeholder="jane@example.com" />
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold-400">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us about your chocolate dreams..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream-100 placeholder-cream-100/40 outline-none transition-colors focus:border-gold-400/60 focus:bg-white/10"
                />
              </div>
              <button
                type="submit"
                className="btn-gold w-full"
              >
                {sent ? 'Message Sent!' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-gold-300"
                >
                  Thank you! We'll be in touch within 24 hours.
                </motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold-400">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream-100 placeholder-cream-100/40 outline-none transition-colors focus:border-gold-400/60 focus:bg-white/10"
      />
    </div>
  );
}
