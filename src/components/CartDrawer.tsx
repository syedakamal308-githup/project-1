import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useShop();

  const shipping = cartTotal > 50 ? 0 : cartTotal > 0 ? 5.95 : 0;
  const total = cartTotal + shipping;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-choco-950/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-cream-100 shadow-choco"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-choco-800/10 bg-white px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-choco-800" />
                <h2 className="font-display text-lg font-bold text-choco-800">
                  Your Cart <span className="text-choco-400">({cartCount})</span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-choco-700 transition-colors hover:bg-choco-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-choco-100 text-choco-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="mt-5 font-display text-lg font-bold text-choco-800">Your cart is empty</p>
                  <p className="mt-1 text-sm text-choco-500">Add some chocolate to make it sweeter.</p>
                  <button onClick={closeCart} className="btn-gold mt-6">
                    Browse Chocolates
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4 rounded-2xl bg-white p-3 shadow-soft"
                      >
                        <div className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${item.product.wrapper}`}>
                          <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover opacity-90 mix-blend-multiply" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-display text-sm font-bold text-choco-800">{item.product.name}</h3>
                              <p className="text-xs text-gold-600">{item.product.flavor}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              aria-label="Remove"
                              className="text-choco-400 transition-colors hover:text-berry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-choco-200">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                aria-label="Decrease"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-choco-700 transition-colors hover:bg-choco-100"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-choco-800">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label="Increase"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-choco-700 transition-colors hover:bg-choco-100"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="font-display text-base font-bold text-choco-800">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-choco-800/10 bg-white px-6 py-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-choco-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-choco-800">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-choco-600">
                    <span>Shipping</span>
                    <span className="font-medium text-choco-800">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gold-600">
                      Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between border-t border-choco-100 pt-2 text-base font-bold text-choco-800">
                    <span>Total</span>
                    <span className="font-display">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="btn-gold mt-4 w-full">
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
