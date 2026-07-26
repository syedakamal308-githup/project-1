import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, ShoppingBag, User, Truck,
  CreditCard, CheckCircle2, Gift, Tag, MapPin, Phone, Mail,
  Package, Sparkles, Download, RotateCcw,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const STEPS = [
  { id: 1, label: 'Cart', icon: ShoppingBag },
  { id: 2, label: 'Details', icon: User },
  { id: 3, label: 'Shipping', icon: Truck },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Review', icon: Package },
  { id: 6, label: 'Done', icon: CheckCircle2 },
];

interface CustomerInfo {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; country: string; city: string; postalCode: string;
}

interface Confetti {
  id: number; x: number; color: string; size: number; delay: number; duration: number;
}

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useShop();
  const [step, setStep] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNumber] = useState(() => `MG-${Date.now().toString().slice(-8)}`);
  const [info, setInfo] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', country: 'United States', city: '', postalCode: '',
  });

  const confetti = useMemo<Confetti[]>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#D4AF37','#E8638A','#7BC9A8','#F2A65A','#F7E9C3','#9CB86E'][i % 6],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    })), []);

  const shipping = shippingMethod === 'express' ? 14.95
    : shippingMethod === 'sameday' ? 24.95
    : shippingMethod === 'international' ? 34.95
    : cartTotal > 50 ? 0 : 5.95;

  const discount = promoApplied ? cartTotal * 0.10 : 0;
  const tax = (cartTotal - discount) * 0.08;
  const total = cartTotal - discount + shipping + tax;
  const giftWrapFee = giftWrap ? 4.99 : 0;
  const grandTotal = total + giftWrapFee;

  const SHIPPING_OPTIONS = [
    { id: 'standard', label: 'Standard Delivery', time: '3–5 business days', price: cartTotal > 50 ? 'Free' : '$5.95', icon: '📦' },
    { id: 'express', label: 'Express Delivery', time: '1–2 business days', price: '$14.95', icon: '⚡' },
    { id: 'sameday', label: 'Same-Day Delivery', time: 'Today by 8 PM (select areas)', price: '$24.95', icon: '🚀' },
    { id: 'international', label: 'International Shipping', time: '7–14 business days', price: '$34.95', icon: '✈️' },
  ];

  const PAYMENT_OPTIONS = [
    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'apple', label: 'Apple Pay', icon: '🍎' },
    { id: 'google', label: 'Google Pay', icon: '🟡' },
    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
  ];

  // Reset step when closed
  useEffect(() => {
    if (!isCheckoutOpen) {
      const t = setTimeout(() => setStep(1), 400);
      return () => clearTimeout(t);
    }
  }, [isCheckoutOpen]);

  const canAdvance = () => {
    if (step === 1) return cart.length > 0;
    if (step === 2) return info.firstName && info.lastName && info.email && info.address && info.city;
    return true;
  };

  const next = () => { if (canAdvance()) setStep(s => Math.min(s + 1, 6)); };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') setPromoApplied(true);
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step < 6 ? closeCheckout : undefined}
            className="fixed inset-0 z-[80] bg-choco-950/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream-50 shadow-choco sm:inset-y-6 sm:rounded-3xl"
          >
            {/* Header */}
            {step < 6 && (
              <div className="flex items-center justify-between border-b border-choco-800/10 bg-white px-6 py-4">
                <h2 className="font-display text-xl font-bold text-choco-800">
                  {step === 1 ? 'Your Cart' : step === 2 ? 'Your Details' : step === 3 ? 'Shipping' : step === 4 ? 'Payment' : 'Order Review'}
                </h2>
                <button
                  onClick={closeCheckout}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-choco-500 transition hover:bg-choco-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step indicator */}
            {step < 6 && (
              <div className="bg-white px-6 pb-4 pt-2">
                <div className="flex items-center justify-between">
                  {STEPS.slice(0, 5).map((s, i) => (
                    <div key={s.id} className="flex flex-1 items-center">
                      <button
                        onClick={() => s.id < step && setStep(s.id)}
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          s.id === step
                            ? 'bg-gold-400 text-choco-900 shadow-glow-gold'
                            : s.id < step
                            ? 'bg-choco-800 text-cream-100'
                            : 'bg-choco-100 text-choco-400'
                        }`}
                      >
                        {s.id < step ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                      </button>
                      {i < 4 && (
                        <div className={`mx-1 h-0.5 flex-1 transition-all ${s.id < step ? 'bg-choco-800' : 'bg-choco-100'}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between px-0.5">
                  {STEPS.slice(0, 5).map(s => (
                    <span key={s.id} className={`flex-1 text-center text-[10px] font-medium uppercase tracking-wide ${s.id === step ? 'text-gold-600' : 'text-choco-400'}`}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="p-6"
                >

                  {/* STEP 1: Cart */}
                  {step === 1 && (
                    <div className="space-y-4">
                      {cart.length === 0 ? (
                        <div className="py-12 text-center">
                          <ShoppingBag className="mx-auto h-12 w-12 text-choco-300" />
                          <p className="mt-3 font-display text-lg text-choco-600">Your cart is empty</p>
                          <button onClick={closeCheckout} className="btn-gold mt-4">Browse Chocolates</button>
                        </div>
                      ) : (
                        <>
                          {cart.map(item => (
                            <div key={item.product.id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft">
                              <div className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${item.product.wrapper}`}>
                                <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover opacity-90 mix-blend-multiply" />
                              </div>
                              <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-display text-sm font-bold text-choco-800">{item.product.name}</p>
                                    <p className="text-xs text-gold-600">{item.product.flavor}</p>
                                  </div>
                                  <button onClick={() => removeFromCart(item.product.id)} className="text-choco-300 hover:text-berry">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 rounded-full border border-choco-200 px-1">
                                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center text-choco-600 hover:text-choco-900">−</button>
                                    <span className="w-5 text-center text-sm font-bold text-choco-800">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center text-choco-600 hover:text-choco-900">+</button>
                                  </div>
                                  <span className="font-display text-sm font-bold text-choco-800">${(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Gift wrap */}
                          <button
                            onClick={() => setGiftWrap(v => !v)}
                            className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 transition-all ${giftWrap ? 'border-gold-400 bg-gold-50' : 'border-choco-100 bg-white hover:border-gold-200'}`}
                          >
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${giftWrap ? 'bg-gold-400' : 'bg-choco-100'}`}>
                              <Gift className={`h-5 w-5 ${giftWrap ? 'text-choco-900' : 'text-choco-500'}`} />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-semibold text-choco-800">Luxury Gift Wrapping</p>
                              <p className="text-xs text-choco-500">Premium gold foil packaging + ribbon (+$4.99)</p>
                            </div>
                            <div className={`h-5 w-5 rounded-full border-2 ${giftWrap ? 'border-gold-400 bg-gold-400' : 'border-choco-200'}`}>
                              {giftWrap && <CheckCircle2 className="h-full w-full text-choco-900" />}
                            </div>
                          </button>

                          {/* Promo code */}
                          <div className="rounded-2xl bg-white p-4 shadow-soft">
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-choco-700">
                              <Tag className="h-4 w-4" /> Promo Code
                            </p>
                            <div className="flex gap-2">
                              <input
                                value={promoCode}
                                onChange={e => setPromoCode(e.target.value)}
                                placeholder="e.g. WELCOME10"
                                disabled={promoApplied}
                                className="flex-1 rounded-xl border border-choco-200 bg-cream-50 px-3 py-2 text-sm text-choco-800 outline-none focus:border-gold-400 disabled:opacity-60"
                              />
                              <button
                                onClick={applyPromo}
                                disabled={promoApplied || !promoCode}
                                className="rounded-xl bg-choco-800 px-4 py-2 text-sm font-semibold text-cream-100 transition hover:bg-choco-700 disabled:opacity-50"
                              >
                                {promoApplied ? '✓ Applied' : 'Apply'}
                              </button>
                            </div>
                            {promoApplied && <p className="mt-1.5 text-xs text-mint">🎉 WELCOME10 applied — 10% off your order!</p>}
                          </div>

                          {/* Summary */}
                          <div className="rounded-2xl bg-white p-4 shadow-soft text-sm space-y-1.5">
                            <div className="flex justify-between text-choco-600"><span>Subtotal ({cartCount} items)</span><span className="font-medium text-choco-800">${cartTotal.toFixed(2)}</span></div>
                            {promoApplied && <div className="flex justify-between text-mint"><span>Discount (10%)</span><span>-${discount.toFixed(2)}</span></div>}
                            {giftWrap && <div className="flex justify-between text-choco-600"><span>Gift Wrapping</span><span className="font-medium text-choco-800">$4.99</span></div>}
                            <div className="flex justify-between text-choco-600"><span>Estimated Shipping</span><span className="font-medium text-choco-800">{cartTotal > 50 ? 'Free' : '$5.95'}</span></div>
                            {cartTotal > 0 && cartTotal < 50 && <p className="text-xs text-gold-600">Add ${(50 - cartTotal).toFixed(2)} more for free shipping!</p>}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* STEP 2: Customer Info */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name" icon={<User className="h-4 w-4" />} value={info.firstName} onChange={v => setInfo(p => ({ ...p, firstName: v }))} placeholder="John" required />
                        <Field label="Last Name" icon={<User className="h-4 w-4" />} value={info.lastName} onChange={v => setInfo(p => ({ ...p, lastName: v }))} placeholder="Smith" required />
                      </div>
                      <Field label="Email Address" icon={<Mail className="h-4 w-4" />} value={info.email} onChange={v => setInfo(p => ({ ...p, email: v }))} placeholder="john@example.com" type="email" required />
                      <Field label="Phone Number" icon={<Phone className="h-4 w-4" />} value={info.phone} onChange={v => setInfo(p => ({ ...p, phone: v }))} placeholder="+1 (555) 000-0000" type="tel" />
                      <Field label="Street Address" icon={<MapPin className="h-4 w-4" />} value={info.address} onChange={v => setInfo(p => ({ ...p, address: v }))} placeholder="123 Chocolate Lane" required />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="City" value={info.city} onChange={v => setInfo(p => ({ ...p, city: v }))} placeholder="New York" required />
                        <Field label="Postal Code" value={info.postalCode} onChange={v => setInfo(p => ({ ...p, postalCode: v }))} placeholder="10001" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-choco-600">Country</label>
                        <select
                          value={info.country}
                          onChange={e => setInfo(p => ({ ...p, country: e.target.value }))}
                          className="w-full rounded-xl border border-choco-200 bg-white px-3 py-2.5 text-sm text-choco-800 outline-none focus:border-gold-400"
                        >
                          {['United States','United Kingdom','Canada','Australia','Germany','France','UAE','Saudi Arabia','Other'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Shipping */}
                  {step === 3 && (
                    <div className="space-y-3">
                      <p className="mb-2 text-sm text-choco-600">All chocolates are packed with temperature-controlled insulation.</p>
                      {SHIPPING_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setShippingMethod(opt.id)}
                          className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${shippingMethod === opt.id ? 'border-gold-400 bg-gold-50' : 'border-choco-100 bg-white hover:border-gold-200'}`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-choco-800">{opt.label}</p>
                            <p className="text-xs text-choco-500">{opt.time}</p>
                          </div>
                          <span className={`font-display text-sm font-bold ${shippingMethod === opt.id ? 'text-gold-600' : 'text-choco-700'}`}>{opt.price}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* STEP 4: Payment */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {PAYMENT_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all ${paymentMethod === opt.id ? 'border-gold-400 bg-gold-50' : 'border-choco-100 bg-white hover:border-gold-200'}`}
                          >
                            <span className="text-xl">{opt.icon}</span>
                            <span className="text-xs font-medium text-choco-700">{opt.label}</span>
                          </button>
                        ))}
                      </div>

                      {(paymentMethod === 'card') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-3 rounded-2xl bg-white p-4 shadow-soft"
                        >
                          <Field label="Card Number" value="" onChange={() => {}} placeholder="4242 4242 4242 4242" />
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Expiry" value="" onChange={() => {}} placeholder="MM / YY" />
                            <Field label="CVV" value="" onChange={() => {}} placeholder="•••" />
                          </div>
                          <Field label="Name on Card" value="" onChange={() => {}} placeholder="John Smith" />
                        </motion.div>
                      )}
                      {(paymentMethod === 'paypal' || paymentMethod === 'apple' || paymentMethod === 'google') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl bg-white p-6 text-center shadow-soft"
                        >
                          <p className="text-sm text-choco-600">You'll be redirected to complete your {PAYMENT_OPTIONS.find(p => p.id === paymentMethod)?.label} payment securely.</p>
                        </motion.div>
                      )}
                      {paymentMethod === 'cod' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl bg-white p-4 text-sm text-choco-600 shadow-soft"
                        >
                          💵 Pay with cash when your order is delivered. Available in select areas only.
                        </motion.div>
                      )}

                      <div className="rounded-xl bg-choco-800/5 p-3 text-center text-xs text-choco-500">
                        🔒 Your payment is secured with 256-bit SSL encryption
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Review */}
                  {step === 5 && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-white p-4 shadow-soft">
                        <p className="mb-3 flex items-center gap-2 font-semibold text-choco-800"><ShoppingBag className="h-4 w-4 text-gold-500" /> Order Items</p>
                        {cart.map(item => (
                          <div key={item.product.id} className="flex justify-between py-1.5 text-sm">
                            <span className="text-choco-700">{item.product.name} × {item.quantity}</span>
                            <span className="font-semibold text-choco-800">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-soft">
                        <p className="mb-3 flex items-center gap-2 font-semibold text-choco-800"><MapPin className="h-4 w-4 text-gold-500" /> Delivery Address</p>
                        <p className="text-sm text-choco-600">{info.firstName} {info.lastName}</p>
                        <p className="text-sm text-choco-600">{info.address}, {info.city} {info.postalCode}</p>
                        <p className="text-sm text-choco-600">{info.country}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-soft text-sm space-y-1.5">
                        <div className="flex justify-between text-choco-600"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                        {promoApplied && <div className="flex justify-between text-mint"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                        {giftWrap && <div className="flex justify-between text-choco-600"><span>Gift Wrapping</span><span>$4.99</span></div>}
                        <div className="flex justify-between text-choco-600"><span>Shipping ({SHIPPING_OPTIONS.find(s => s.id === shippingMethod)?.label})</span><span>{SHIPPING_OPTIONS.find(s => s.id === shippingMethod)?.price}</span></div>
                        <div className="flex justify-between text-choco-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                        <div className="flex justify-between border-t border-choco-100 pt-2 text-base font-bold text-choco-800">
                          <span>Total</span>
                          <span className="font-display text-gold-600">${grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: Success */}
                  {step === 6 && (
                    <div className="relative overflow-hidden rounded-2xl text-center">
                      {/* Confetti */}
                      {confetti.map(c => (
                        <motion.div
                          key={c.id}
                          className="pointer-events-none absolute top-0 rounded-sm"
                          style={{ left: `${c.x}%`, width: c.size, height: c.size, background: c.color }}
                          initial={{ y: -20, opacity: 1, rotate: 0 }}
                          animate={{ y: 500, opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
                          transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
                        />
                      ))}

                      <div className="relative z-10 py-6">
                        {/* Gift box animation */}
                        <motion.div
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 }}
                          className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 shadow-glow-gold"
                        >
                          <motion.span
                            className="text-5xl"
                            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                          >
                            🎁
                          </motion.span>
                        </motion.div>

                        <motion.h3
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="font-display text-2xl font-bold text-choco-800"
                        >
                          🎉 Thank You for Choosing Moggy Chocolate!
                        </motion.h3>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="mx-auto mt-3 max-w-sm text-sm text-choco-600"
                        >
                          Your order has been placed successfully. We'll prepare your freshly crafted chocolates and deliver them with love and care.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 }}
                          className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-choco-900 px-5 py-2"
                        >
                          <Sparkles className="h-4 w-4 text-gold-400" />
                          <span className="font-display text-sm font-bold text-cream-100">Order {orderNumber}</span>
                        </motion.div>

                        {/* Truck animation */}
                        <motion.div
                          initial={{ x: -80, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 20 }}
                          className="mt-5 text-4xl"
                        >
                          🚚
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5 }}
                          className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
                        >
                          <button className="btn-gold" onClick={() => alert('Tracking coming soon!')}>
                            Track Order
                          </button>
                          <button
                            onClick={closeCheckout}
                            className="btn-ghost"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Continue Shopping
                          </button>
                          <button className="btn-ghost" onClick={() => alert('Invoice download coming soon!')}>
                            <Download className="h-4 w-4" />
                            Invoice
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            {step < 6 && (
              <div className="border-t border-choco-100 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  {step > 1 ? (
                    <button onClick={back} className="flex items-center gap-1 text-sm font-medium text-choco-600 hover:text-choco-800">
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                  ) : <div />}
                  <div className="flex items-center gap-3">
                    {step < 5 && (
                      <span className="text-sm text-choco-500 hidden sm:block">
                        {step === 1 && `${cartCount} item${cartCount !== 1 ? 's' : ''}`}
                        {step === 5 && `$${grandTotal.toFixed(2)}`}
                      </span>
                    )}
                    <button
                      onClick={step === 5 ? next : next}
                      disabled={!canAdvance()}
                      className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {step === 5 ? 'Place Order' : 'Continue'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label, icon, value, onChange, placeholder, type = 'text', required,
}: {
  label: string; icon?: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-choco-600">
        {icon}{label}{required && <span className="text-berry">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-choco-200 bg-white px-3 py-2.5 text-sm text-choco-800 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
      />
    </div>
  );
}
